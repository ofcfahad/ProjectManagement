/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
//Others
import { motion } from "framer-motion"
import axios from 'axios'
//Icons
import { IconContext } from "react-icons";
import { ArrowLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import 'react-tooltip/dist/react-tooltip.css'
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { Info } from '../';


const ForgotPassword = (props: any) => {

    const [userEmailInputController, setUserEmailInputController] = useState('')
    const [inputIsFocused, setInputIsFocused] = useState('')
    const [ishovering, setIsHovering] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmailInputController);

    const submitFunction = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        if (isEmailValid) {
            const response = await axios.post('/server/api/forgotPassword', { userEmail: userEmailInputController })
            if (response.status === 200) {
                setEmailSent(true)
            }
        }
    }

    const handleCloseDialogClick = () => {
        props.setForgotPassword(false)
    }


    return (
        <motion.div className='flex flex-col bg-white/30 backdrop-blur h-[280px] px-4 rounded-3xl font-josefin '>
            <ArrowLeftIcon className='w-5 text-black cursor-pointer mt-2' onClick={handleCloseDialogClick} />
            <div className='mt-4'>
                <div className='flex justify-center items-center'>
                    <span className='text-[20px]'>
                        Forgot Password
                    </span>
                </div>
                <form onSubmit={submitFunction} className='mt-5'>
                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userEmailInputController != '' || inputIsFocused === 'userEmailInputBar' ? 0 : 10 }} className={`flex mt-2 items-center px-2 border-2 border-transparent rounded-none ${userEmailInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userEmailInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px]'}`}>
                        <div className=''>
                            <IconContext.Provider value={{ size: '20', color: userEmailInputController ? '#2563eb' : inputIsFocused === 'userEmailInputBar' ? '#734ae3' : 'black' }}>
                                <MdOutlineAlternateEmail />
                            </IconContext.Provider>
                        </div>
                        <div className='ml-2'>
                            <input type="text" className={`px-2 py-2 font-alkatra bg-transparent focus:outline-none rounded-xl autofill:bg-black `} id='userEmailInputField' placeholder='Email' autoComplete='YourName' value={userEmailInputController} onChange={(event) => setUserEmailInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userEmailInputBar')} onBlur={() => setInputIsFocused('')} />
                        </div>
                    </motion.div>

                    <div className='w-full flex justify-center items-center mt-4'>
                        <Info button={
                            <motion.button animate={{ width: ishovering === 'continue' ? 140 : 90 }} type='submit' disabled={!isEmailValid} className={`btn btn-primary !flex !justify-between !items-center !bg-gradient-to-br ${!isEmailValid ? 'from-red-200 to-red-500' : 'from-blue-200 to-blue-500 hover:from-green-200 hover:to-green-500'} hover:shadow-lg !border-none `} onMouseEnter={() => setIsHovering('continue')} onMouseLeave={() => setIsHovering('')}>
                                <span>
                                    Continue
                                </span>
                                {ishovering === 'continue' &&
                                    <ArrowLongRightIcon className='w-5 ml-2' />}
                            </motion.button>
                        } title={'Email Sent'} isOpen={emailSent} onClose={handleCloseDialogClick} description={`An Email is sent to your Email ${userEmailInputController}. Click the link provided in the Email and set a new Password. The link in the Email will expire in 1 hour `} />
                    </div>
                </form>

            </div>
        </motion.div>
    )
}

export default ForgotPassword