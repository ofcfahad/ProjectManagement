/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
//Others
import { motion } from "framer-motion"
//Icons
import { ArrowLongRightIcon, CheckIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import queryString from 'query-string';
import { notification } from 'antd';
import UseAnimations from 'react-useanimations';
import loadingIcon from 'react-useanimations/lib/loading'
import { useApi } from '../Contexts';

const ResetPassword = (props: any) => {

    const [userPasswordInputController, setUserPasswordInputController] = useState('')
    const [inputIsFocused, setInputIsFocused] = useState(false)
    const [ishovering, setIsHovering] = useState(false)
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [token, setToken] = useState<string>()

    const { resetPassword } = useApi()

    const [api, contextHolder] = notification.useNotification();

    const showNotification = (type: 'success' | 'error', message: string, description: JSX.Element) => {
        api[type]({
            message,
            description,
            duration: 5,
            onClose: handleGoBackClick
        });
        setTimeout(() => {
            handleGoBackClick()
        }, 5000)
    };

    const submitFunction = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        if (userPasswordInputController.length < 8 || !token) {
            return
        }
        setLoading(true)

        if (await resetPassword(userPasswordInputController, token)) {
            setDone(true)
            showNotification(
                'success', 'Password Changed',
                <div>
                    Your Password has been changed.
                </div>
            )
        } else {
            showNotification(
                'error', 'Something went wrong',
                <div>
                    Invalid or Expired Link.
                </div>
            )
            setDone(false)
        }

        setLoading(false)
    }

    const handleGoBackClick = () => {
        setUserPasswordInputController('')
        setDone(false)
        window.history.replaceState({}, document.title, '/');
        props.setResetPassword(false)
    }

    function isJWT(token: string) {
        const parts = token.split('.');
        return parts.length === 3;
    }

    useEffect(() => {
        const token = queryString.parse(location.search).token?.toString()
        if (!token || !isJWT(token)) {
            return window.location.reload()
        }
        setToken(token)
    }, [])

    return (
        <motion.div className='flex h-[300px] w-full select-none'>
            {contextHolder}

            <div className='p-1 w-8 h-8 flex justify-center items-center border hover:bg-white/20 rounded-full'>
                <XMarkIcon className='w-5 text-black cursor-pointer' onClick={handleGoBackClick} />
            </div>

            <div className='flex flex-col px-4 gap-3'>

                <span className='text-3xl mt-1'>
                    Reset Password
                </span>

                <span className='text-lg font-ubuntu'>
                    Enter your new password.
                    <br />
                    Make sure it is a strong one
                </span>

                <form onSubmit={submitFunction} className='flex flex-col w-full gap-4'>

                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userPasswordInputController != '' || inputIsFocused ? 0 : 10 }} className={`flex items-center px-2 gap-2 border-2 w-full border-transparent rounded-none ${userPasswordInputController != '' ? 'border-b-blue-600' : inputIsFocused ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px]'}`}>
                        <LockClosedIcon className='w-6' style={{ color: userPasswordInputController != '' ? '#2563eb' : inputIsFocused ? '#734ae3' : 'black' }} />
                        <input type="password" className={`px-2 py-2 bg-transparent focus:outline-none rounded-xl autofill:bg-black w-full`} placeholder='Password' autoComplete='new-password' value={userPasswordInputController} onChange={(event) => setUserPasswordInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused(true)} onBlur={() => setInputIsFocused(false)} />
                    </motion.div>

                    <motion.button animate={{ width: ishovering || loading || done ? 200 : 100 }} type='submit' disabled={userPasswordInputController.length < 8 || loading || done} className={`flex justify-between items-center py-2 px-3 rounded-lg bg-gradient-to-br ${loading || done ? 'from-green-200 to-green-500' : userPasswordInputController.length < 8 ? 'from-red-200 to-red-500' : 'from-blue-200 to-blue-500 hover:from-green-200 hover:to-green-500'} hover:shadow-lg border-none focus:outline-none text-white`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        <span className=''>
                            {
                                done ?
                                    'Password Changed'
                                    :
                                    loading ?
                                        'Loading'
                                        :
                                        'Continue'
                            }
                        </span>
                        {
                            done ?
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

export default ResetPassword