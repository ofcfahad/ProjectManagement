import { useEffect, useState } from 'react'
//Others
import { motion } from "framer-motion"
import OtpInput from 'react-otp-input';
import { protect_email } from '../utils';
//Icons
import { IconContext } from "react-icons";
import { CiEraser } from 'react-icons/ci';
import { ArrowLeftIcon, ArrowLongRightIcon, ClipboardIcon, } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading'
import { message } from 'antd';
import { useApi } from '../Contexts';


const EmailAuthentication = ({ userEmail, userPassword, handleGoBackClick, fetchUser }: { userEmail: string, userPassword: string, handleGoBackClick: () => void, fetchUser: () => void }) => {

    const [otp, setOtp] = useState('');
    const [wrongOTP, setWrongOTP] = useState(false)
    const [verifyingOTP, setVerifyingOTP] = useState(false)

    const { sendOTP, verifyOTP } = useApi()

    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Email with an OTP sent!',
        });
    };

    const handleCopyAndSetOtp = async () => {
        const copiedText = await navigator.clipboard.readText();
        const _otp = copiedText.split(' ').join('').slice(0, 6)
        setOtp(_otp);
    };

    const SendOTP = async () => {
        if (await sendOTP(userEmail)) {
            success()
        }
    }

    const VerifyOTP = async () => {
        setVerifyingOTP(true)
        if (await verifyOTP(userEmail, userPassword, otp)) {
            setWrongOTP(false)
            fetchUser()
        } else {
            setWrongOTP(true)
        }
        setVerifyingOTP(false)
    }

    useEffect(() => {
        if (otp.length === 6) {
            VerifyOTP()
        }
        if (otp.length === 0) {
            setWrongOTP(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp])

    return (
        <motion.div className='flex flex-col h-full gap-4'>
            {contextHolder}
            <div className='p-1 w-8 h-8 flex justify-center items-center border hover:bg-white/20 rounded-full'>
                <ArrowLeftIcon className='w-5 text-black cursor-pointer' onClick={handleGoBackClick} />
            </div>
            <div>

                <div className='flex flex-col mt-2'>

                    <div className='w-full'>

                        <div className='flex flex-col justify-center items-center gap-2 font-ubuntu w-full'>
                            <span className='text-lg w-[70%]'>
                                An Email with OTP is sent to your Email address <b>{protect_email(userEmail)}</b>
                            </span>
                            <span className='text-xs w-[70%]'>
                                Didn't Recieve Email or OTP Expired? <button className='text-selectedicon' onClick={SendOTP}>Resend</button>
                            </span>
                        </div>

                    </div>

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

                    <div className='w-full flex justify-center items-center gap-2 mt-3'>
                        <ClipboardIcon className='w-5' onClick={handleCopyAndSetOtp} style={{ cursor: 'pointer' }} />
                        <IconContext.Provider value={{ size: '20', color: 'black' }}>
                            <CiEraser onClick={() => setOtp('')} style={{ cursor: 'pointer' }} />
                        </IconContext.Provider>
                    </div>

                    <div className='flex justify-center items-center mt-4'>

                        <motion.button animate={{ width: verifyingOTP ? 150 : 100 }} type='submit' disabled={otp.length < 6 || verifyingOTP} className={`flex justify-between items-center py-2 px-3 rounded-lg bg-gradient-to-br ${otp.length < 6 ? 'bg-gradient-to-r from-red-400 to-red-600 ' : 'bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-emerald-300 hover:to-green-600'} hover:shadow-lg border-none focus:outline-none text-white`} onClick={VerifyOTP}>
                            <span className=''>
                                {
                                    verifyingOTP ?
                                        'Verifying'
                                        :
                                        'Verify'
                                }
                            </span>
                            {
                                verifyingOTP ?
                                    <UseAnimations animation={loading} strokeColor='white' />
                                    :
                                    <ArrowLongRightIcon className='w-5 text-white' />
                            }
                        </motion.button>

                    </div>


                </div>
            </div>


        </motion.div>

    )
}

export default EmailAuthentication