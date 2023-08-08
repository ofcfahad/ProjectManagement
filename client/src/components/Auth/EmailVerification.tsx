/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
//AppComponents
import { protect_email } from '../functions';
import { Confirmation } from '../Popups';
//Others
import { AnimatePresence, motion } from "framer-motion"
import OtpInput from 'react-otp-input';
import axios from 'axios'
import Cookies from 'js-cookie';
import { Tooltip } from 'react-tooltip'
//Icons
import { IconContext } from "react-icons";
import { CiEraser } from 'react-icons/ci';
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { ArrowLeftIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import UseAnimations from 'react-useanimations';
import infinity from 'react-useanimations/lib/infinity'

const EmailVerification = ({ userName, setUserName, userPassword, setUserPassword, settoEmailVerification, setNoEmail, setUserLoggedIn }: { userName: string, setUserName: any, userPassword: string, setUserPassword: any, settoEmailVerification: any, setNoEmail: any, setUserLoggedIn: any }) => {

    const [userEmailInputController, setUserEmailInputController] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [inputIsFocused, setInputIsFocused] = useState('')
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState('')
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [wrongOTP, setWrongOTP] = useState(false)
    const [verifyingOTP, setVerifyingOTP] = useState(false)
    const [emailIsSentAgain, setEmailIsSentAgain] = useState(0)
    const [emailSendLoading, setEmailSendLoading] = useState(false)
    const [ishovering, setIsHovering] = useState('')
    const [otpInputisShown, setOTPInputisShown] = useState(false)
    const [showNotToVerifyAlert, setShowNotToVerifyAlert] = useState(false)


    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmailInputController);

    const handleCopyAndSetOtp = async () => {
        setOtp('')
        const copiedText = await navigator.clipboard.readText();
        setOtp(copiedText);
    };

    const handleGoBackClick = () => {
        setUserName('')
        setUserPassword('')
        setUserEmailInputController('')
        setUserEmail('')
        settoEmailVerification(false)
        setNoEmail(false)
        setEmailAlreadyExists(false)
    }

    const sendVerificationEmail = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        setEmailSendLoading(true)
        setButtonDisabled('send')
        setEmailAlreadyExists(false)
        if (isEmailValid) {
            try {
                const response = await axios.post(`/server/api/sendOTP`, { userEmail: userEmailInputController })
                if (response.status === 200) {
                    setUserEmail(userEmailInputController)
                    setEmailSent(true)
                    setOTPInputisShown(true)
                    setEmailAlreadyExists(false)
                    setEmailIsSentAgain(emailIsSentAgain + 1)
                } else {
                    console.log(response.data.message);
                }
            } catch (error: any) {
                setButtonDisabled('')
                if (error.response && error.response.status === 409) {
                    setEmailAlreadyExists(true)
                } else {
                    console.log(`from sendVerificationEmail: ${error}`);
                }
            }
        }

        setButtonDisabled('')
        setEmailSendLoading(false)
    }

    const verifyOTP = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        setButtonDisabled('otp')
        setVerifyingOTP(true)
        try {
            const response = await axios.post(`/server/api/verifyOTP`, { userEmail: userEmailInputController, otp: otp })
            const data = response.status
            if (data === 200) {
                setOtpVerified(true)
                setWrongOTP(false)
                postEmailtoDatabase()
            } else {
                setWrongOTP(true)
            }
        } catch (error) {
            console.log(`from verifyOTP: ${error}`);
            setOtpVerified(false)
        }
        setVerifyingOTP(false)
    }

    const postEmailtoDatabase = async () => {
        event?.preventDefault()
        try {
            const response = await axios.put(`/server/api/updateEmail`, { userName: userName, userPassword: userPassword, userEmail: userEmailInputController })
            const token = response.data.token
            Cookies.set('session', token, { expires: 7 })
            setUserLoggedIn(true)
        } catch (error) {
            console.log(`from postEmailtoDatabase: ${error}`);
        }
    }

    const handleNottoVerify = async () => {
        event?.preventDefault()
        try {
            const response = await axios.put(`/server/api/notVerified`, { userName: userName, userPassword: userPassword })
            const token = response.data.token
            Cookies.set('session', token, { expires: 7 })
            setUserLoggedIn(true)
        } catch (error) {
            console.log(`from handleNottoVerify: ${error}`);
        }
    }

    const handleNottoVerifyClick = async () => {
        event?.preventDefault()
        setShowNotToVerifyAlert(true)
    }

    return (
        <motion.div className='flex flex-col h-full w-full px-2 bg-white/30 backdrop-blur rounded-3xl '>
            <div className='py-2 flex flex-col justify-between'>
                <ArrowLeftIcon className='w-5 text-black cursor-pointer ' onClick={handleGoBackClick} />
                <div className='text-[20px] mt-2 flex justify-center'>
                    Well let's get you verified
                </div>
            </div>
            <motion.div className='h-[85%] w-full'>
                <motion.div className=''>
                    {
                        emailSent ?
                            <span className=''>
                                An Email with OTP is sent to your Email address <b>{protect_email(userEmail)}</b>
                                <div className='h-2'></div>
                                <span className='text-sm'>
                                    Didn't Recieve or Email Expired? <button disabled={emailIsSentAgain >= 2} className='text-selectedicon' onClick={sendVerificationEmail}>Resend</button>
                                </span>
                            </span>
                            :
                            emailSendLoading ?
                                <span>
                                    Sending Email with OTP to <b>{protect_email(userEmailInputController)}</b>
                                </span>
                                :
                                <span>
                                    We would send verification otp to your email <b>{userEmail && protect_email(userEmail)}</b>
                                </span>
                    }
                    <form className='flex flex-col h-[80%]' onSubmit={sendVerificationEmail} >

                        <motion.div className={`mt-4 flex items-center px-2 border-2 border-transparent rounded-none ${emailAlreadyExists && userEmailInputController ? 'border-b-red-500' : userEmailInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'email' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px]'}`} animate={{ borderRadius: userEmailInputController != '' || inputIsFocused === 'email' ? 0 : 10 }} data-tooltip-id='emailinput' >
                            <div>
                                <MdOutlineAlternateEmail className='w-6' style={{ color: emailAlreadyExists && userEmailInputController ? 'red' : userEmailInputController ? '#2563eb' : inputIsFocused === 'email' ? '#734ae3' : 'black' }} />
                            </div>
                            <div className='ml-5'>
                                <input type={'email'} className={`px-2 py-2 focus:outline-none ${emailAlreadyExists ? 'text-red-500' : 'text-black'} `} style={{ background: 'transparent' }} placeholder='email' autoComplete='off' value={userEmailInputController} onChange={(event) => setUserEmailInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('email')} onBlur={() => setInputIsFocused('')} />
                            </div>
                        </motion.div>
                        <Tooltip id='emailinput' content={emailAlreadyExists && userEmailInputController ? 'Email Already Exists' : ''} style={{ background: emailAlreadyExists ? 'red' : '' }} />

                        <div className='flex justify-center items-center mt-4'>
                            <motion.button type='submit' animate={{ width: ishovering === 'sendEmail' && !emailSent && !wrongOTP ? 170 : 160 }} disabled={buttonDisabled === 'send' || emailIsSentAgain >= 2} className={`btn btn-primary !flex !justify-center !items-center !bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-emerald-300 hover:to-green-600 backdrop-blur !border-none !text-white !text-sm `} style={{ transition: 'background-color 1s ease' }} onMouseOver={() => setIsHovering('sendEmail')} onMouseOut={() => setIsHovering('')} >
                                {emailSendLoading ?
                                    <UseAnimations animation={infinity} className='' />
                                    :
                                    emailSent || wrongOTP ?
                                        'Resend'
                                        :
                                        'Send Verification Pin'
                                }
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
                <AnimatePresence>
                    {
                        otpInputisShown &&
                        <motion.div className='' initial={{ x: 100, y: 0, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} exit={{ opacity: 0, x: -999 }} >
                            <div className='w-full flex justify-center items-center mt-4'>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={6}
                                    placeholder='000000'
                                    renderInput={(props) => <input {...props} />}
                                    containerStyle={'flex items-center bg-whitee rounded-xl'}
                                    inputStyle={{ width: 40, height: 40, borderRadius: 10, border: wrongOTP ? 'solid red 2px' : otpVerified ? 'solid green 2px' : 'solid white 2px', marginLeft: 5, outlineWidth: 1, outlineColor: otp.length > 0 ? '#2563eb' : '#734ae3', backgroundColor: 'white' }}
                                />
                            </div>
                            <div className='w-full flex justify-center items-center mt-3'>
                                <ClipboardIcon className='w-4' onClick={handleCopyAndSetOtp} style={{ cursor: 'pointer' }} />
                                <IconContext.Provider value={{ size: '18', color: 'black' }}>
                                    <CiEraser className='ml-5 cursor-pointer' onClick={() => setOtp('')} />
                                </IconContext.Provider>
                            </div>

                            <div className='flex justify-center items-center mt-4'>
                                <button className={`btn btn-primary ${otp.length < 6 ? '!bg-gradient-to-r from-red-400 to-red-600 ' : '!bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-emerald-300 hover:to-green-600'} backdrop-blur !border-none !text-white !text-sm`} disabled={otp.length < 6 || otp.length > 6 || buttonDisabled === 'otp' || !emailSent} onClick={verifyOTP} >
                                    {verifyingOTP ?
                                        <UseAnimations animation={infinity} className='mx-3' />
                                        :
                                        'Verify OTP'
                                    }
                                </button>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>

                <Confirmation button={<button className='fixed bottom-3 left-16 text-sm text-selectedicon' onClick={handleNottoVerifyClick}>
                    i do not want to be verified
                </button>} isOpen={showNotToVerifyAlert} onClose={() => setShowNotToVerifyAlert(false)} customSubmitButton={handleNottoVerify} title={`Continue non-verified?`} description={`if you lost your credentials, that would be goodbye to your account and other data in our site, and some attacker can exploit your account easily`} customSubmitButtonTitle={`yeah whatever!`} />
            </motion.div>

        </motion.div>
    )
}

export default EmailVerification