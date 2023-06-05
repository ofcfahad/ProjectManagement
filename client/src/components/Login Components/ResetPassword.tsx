/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
//Others
import { motion } from "framer-motion"
import axios from 'axios'
//Icons
import { IconContext } from "react-icons";
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import { Info } from '..';
import { CiLock, CiUnlock } from 'react-icons/ci';


const ResetPassword = (props: any) => {

    const [userPasswordInputController, setUserPasswordInputController] = useState('')
    const [inputIsFocused, setInputIsFocused] = useState('')
    const [ishovering, setIsHovering] = useState('')
    const [done, setDone] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    const submitFunction = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        const response = await axios.post('/server/api/resetPassword', { userPassword: userPasswordInputController, token: props.token })
        if (response.data === 'Password Changed') {
            setErrorMessage('')
            setDone(true)
        } else {
            setErrorMessage(response.data)
            setDone(true)
        }
    }

    const handleDialogCloseClick = () => {
        setUserPasswordInputController('')
        props.setResetPassword(false)
        window.history.replaceState({}, document.title, window.location.pathname);
        setDone(false)
    }


    return (
        <motion.div className='flex flex-col justify-between items-center bg-white/30 backdrop-blur h-[280px] px-4 rounded-3xl font-josefin '>
            <div className='mt-10'>
                <div className='flex justify-center items-center'>
                    <span className='text-[20px]'>
                        Reset Password
                    </span>
                </div>
                <form onSubmit={submitFunction} className='mt-5'>
                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userPasswordInputController != '' || inputIsFocused === 'userPasswordInputBar' ? 0 : 10 }} className={`flex mt-2 items-center px-2 border-2 border-transparent rounded-none ${userPasswordInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userPasswordInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px]'}`}>
                        <div className=''>
                            <IconContext.Provider value={{ size: '25', color: userPasswordInputController ? '#2563eb' : inputIsFocused === 'userPasswordInputBar' ? '#734ae3' : 'black' }}>
                                {
                                    userPasswordInputController.length < 8 ?
                                        <CiUnlock />
                                        :
                                        <CiLock />
                                }
                            </IconContext.Provider>
                        </div>
                        <div className='ml-2'>
                            <input type="password" className={`px-2 py-2 font-alkatra bg-transparent focus:outline-none rounded-xl autofill:bg-black `} id='userPasswordInputField' placeholder='Password' autoComplete='YourName' value={userPasswordInputController} onChange={(event) => setUserPasswordInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userPasswordInputBar')} onBlur={() => setInputIsFocused('')} />
                        </div>
                    </motion.div>

                    <div className='w-full flex justify-center items-center mt-4'>
                        <Info button={
                            <motion.button animate={{ width: ishovering === 'continue' ? 140 : 90 }} type='submit' disabled={userPasswordInputController.length < 8} className={`btn btn-primary !flex !justify-between !items-center !bg-gradient-to-br ${userPasswordInputController.length < 8 ? 'from-red-200 to-red-500' : 'from-blue-200 to-blue-500 hover:from-green-200 hover:to-green-500'} hover:shadow-lg !border-none `} onMouseEnter={() => setIsHovering('continue')} onMouseLeave={() => setIsHovering('')}>
                                <span>
                                    Continue
                                </span>
                                {ishovering === 'continue' &&
                                    <ArrowLongRightIcon className='w-5 ml-2' />}
                            </motion.button>
                        } title={errorMessage || 'Password Changed'} isOpen={done} onClose={handleDialogCloseClick} description={''} />
                    </div>
                </form>

            </div>
        </motion.div>
    )
}

export default ResetPassword