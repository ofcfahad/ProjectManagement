/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
//Others
import { AnimatePresence, motion } from "framer-motion"
import OtpInput from 'react-otp-input';
import axios from 'axios'
import Cookies from 'js-cookie';
import { protect_email } from '../functions';
//Icons
import { IconContext } from "react-icons";
import { CiEraser } from 'react-icons/ci';
import { ArrowLeftIcon, ClipboardIcon, } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import UseAnimations from 'react-useanimations';
import infinity from 'react-useanimations/lib/infinity'


const EmailAuthentication = ({ userEmail, userPassword, handleGoBackClick, setUserLoggedIn }: { userEmail: string, userPassword: string, handleGoBackClick: any, setUserLoggedIn: any }) => {

    const [emailSent, setEmailSent] = useState(false)
    const [otp, setOtp] = useState('');
    const [wrongOTP, setWrongOTP] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState('')
    const [emailSendLoading, setEmailSendLoading] = useState(false)
    const [verifyingOTP, setVerifyingOTP] = useState(false)
    const [ishovering, setIsHovering] = useState('')
    const [emailIsSentAgain, setEmailIsSentAgain] = useState(0)
    const [otpInputisShown, setOTPInputisShown] = useState(false)

    const handleCopyAndSetOtp = async () => {
        const copiedText = await navigator.clipboard.readText();
        setOtp(copiedText);
    };

    const sendOTP = async () => {
        setEmailIsSentAgain(emailIsSentAgain + 1)
        setEmailSendLoading(true)
        setButtonDisabled('send')
        try {
            const response = await axios.post(`/server/api/sendAuthenticationOTP`, { userEmail: userEmail })
            const status = response.status
            if (status != 200) {
                console.log('error');
            } else {
                setEmailSent(true)
                setOTPInputisShown(true)
            }
            setButtonDisabled('')
        } catch (error) {
            console.log(error);
            setButtonDisabled('')
        }
        setEmailSendLoading(false)
    }

    const verifyOTP = async () => {
        setVerifyingOTP(true)
        setButtonDisabled('otp')
        try {
            const response = await axios.post(`/server/api/verifyAuthenticationOTP`, { userEmail: userEmail, userPassword: userPassword, otp: otp })
            if (response.status === 200) {
                setWrongOTP(false)
                const token = response.data.token
                Cookies.set('session', token, { expires: 7 })
                setUserLoggedIn(true)
            }
        } catch (error) {
            console.log(error);
            setWrongOTP(true)
            setButtonDisabled('')
        }
        setVerifyingOTP(false)
    }


    return (
        <motion.div className='flex flex-col justify-between h-full w-full bg-white/30 backdrop-blur px-4 rounded-3xl'>
            <ArrowLeftIcon className='w-5 text-black cursor-pointer mt-4' onClick={handleGoBackClick} />
            <span className='text-[25px] h-[20%] mt-2'>
                Alright, let's verify if it's you trying to login
            </span>
            <form className='flex flex-col h-[80%] mt-2'>

                <div className='w-full'>
                    {
                        emailSent ?
                            <span className=''>
                                An Email with OTP is sent to your Email address <b>{protect_email(userEmail)}</b>
                                <div className='h-2'></div>
                                <span className='text-sm'>
                                    Didn't Recieve or Email Expired? <button disabled={emailIsSentAgain >= 2} className='text-selectedicon' onClick={sendOTP}>Resend</button>
                                </span>
                            </span>
                            :
                            emailSendLoading ?
                                <span>
                                    Sending Email with OTP to <b>{protect_email(userEmail)}</b>
                                </span>
                                :
                                <span>
                                    {
                                        userEmail &&
                                        <span>
                                            We would send verification otp to your email <b>{protect_email(userEmail)}</b>
                                        </span>
                                    }
                                </span>
                    }

                    <div className='flex justify-center items-center mt-4'>
                        <motion.button animate={{ width: ishovering === 'sendEmail' && !emailSent && !wrongOTP ? 170 : 160 }} disabled={buttonDisabled === 'send'} className={`btn btn-primary !flex !justify-center !items-center !bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-emerald-300 hover:to-green-600 backdrop-blur !border-none !text-white !text-sm `} style={{ transition: 'background-color 1s ease' }} onClick={sendOTP} onMouseOver={() => setIsHovering('sendEmail')} onMouseOut={() => setIsHovering('')} >
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
                </div>

                <AnimatePresence>
                    {
                        otpInputisShown &&
                        <motion.div initial={{ x: 100, y: 0, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} exit={{ opacity: 0, x: -999 }} >
                            <div className='w-full flex justify-center items-center mt-4'>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={6}
                                    placeholder='000000'
                                    renderInput={(props) => <input {...props} />}
                                    containerStyle={'flex items-center bg-whitee rounded-xl'}
                                    inputStyle={{ width: 40, height: 40, borderRadius: 10, border: wrongOTP ? 'solid red 2px' : 'solid white 2px', marginLeft: 5, outlineWidth: 1, outlineColor: otp.length > 0 ? '#2563eb' : '#734ae3', backgroundColor: 'white' }}
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


            </form>

        </motion.div>

    )
}

export default EmailAuthentication