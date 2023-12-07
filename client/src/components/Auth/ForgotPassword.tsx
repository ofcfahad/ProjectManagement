/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
//Others
import { motion } from "framer-motion"
//Icons
import { IconContext } from "react-icons";
import { ArrowLeftIcon, ArrowLongRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { notification } from 'antd';
import { useApi } from '../Contexts';
import UseAnimations from 'react-useanimations';
import loadingIcon from 'react-useanimations/lib/loading'

const ForgotPassword = (props: any) => {

    const [userEmailInputController, setUserEmailInputController] = useState('')
    const [inputIsFocused, setInputIsFocused] = useState('')
    const [ishovering, setIsHovering] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const { forgotPassword } = useApi()

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmailInputController);

    const [api, contextHolder] = notification.useNotification();

    const showNotification = () => {
        api['success']({
            message: 'Email Sent',
            description:
                <div>
                    If you're registered with, an Email is sent to <b>{userEmailInputController}</b>.
                    Click the link provided in the Email and set a new Password.
                    The link in the Email will expire in 1 hour,
                </div>,
            duration: 5,
            onClose: handleGoBackClick
        });
        setTimeout(() => {
            handleGoBackClick()
        }, 5000)
    };

    const submitFunction = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        if (!isEmailValid) {
            return
        }
        setLoading(true)

        if (await forgotPassword(userEmailInputController)) {
            setSent(true)
            showNotification()
        } else {
            setSent(false)
        }

        setLoading(false)
    }

    const handleGoBackClick = () => {
        props.setForgotPassword(false)
    }

    return (
        <motion.div className='flex h-[300px] w-full select-none'>
            {contextHolder}

            <div className='p-1 w-8 h-8 flex justify-center items-center border hover:bg-white/20 rounded-full'>
                <ArrowLeftIcon className='w-5 text-black cursor-pointer' onClick={handleGoBackClick} />
            </div>

            <div className='flex flex-col px-4 gap-3'>

                <span className='text-3xl mt-1'>
                    Forgot Password
                </span>

                <span className='text-lg font-ubuntu'>
                    Enter your email and we will send you a link to reset your password
                </span>

                <form onSubmit={submitFunction} className='flex flex-col w-1/2 gap-4'>

                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userEmailInputController != '' || inputIsFocused === 'userEmailInputBar' ? 0 : 10 }} className={`flex items-center px-2 border-2 w-full border-transparent rounded-none ${userEmailInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userEmailInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px]'}`}>
                        <div className=''>
                            <IconContext.Provider value={{ size: '20', color: userEmailInputController ? '#2563eb' : inputIsFocused === 'userEmailInputBar' ? '#734ae3' : 'black' }}>
                                <MdOutlineAlternateEmail />
                            </IconContext.Provider>
                        </div>
                        <div className='ml-2'>
                            <input type="text" className={`px-2 py-2 bg-transparent focus:outline-none rounded-xl autofill:bg-black w-full`} placeholder='Email' autoComplete='email' value={userEmailInputController} onChange={(event) => setUserEmailInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userEmailInputBar')} onBlur={() => setInputIsFocused('')} />
                        </div>
                    </motion.div>

                    <motion.button animate={{ width: ishovering || loading || sent ? 150 : 100 }} type='submit' disabled={!isEmailValid || loading || sent} className={`flex justify-between items-center py-2 px-3 rounded-lg bg-gradient-to-br ${loading || sent ? 'from-green-200 to-green-500' : !isEmailValid ? 'from-red-200 to-red-500' : 'from-blue-200 to-blue-500 hover:from-green-200 hover:to-green-500'} hover:shadow-lg border-none focus:outline-none text-white`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        <span className=''>
                            {
                                sent ?
                                    'Sent'
                                    :
                                    loading ?
                                        'Loading'
                                        :
                                        'Continue'
                            }
                        </span>
                        {
                            sent ?
                                <CheckIcon className='w-5 text-white' />
                                :
                                loading ?
                                    <UseAnimations animation={loadingIcon} strokeColor='white' />
                                    :
                                    <ArrowLongRightIcon className='w-5 text-white' />
                        }
                    </motion.button>

                </form>

            </div>

        </motion.div>
    )
}

export default ForgotPassword