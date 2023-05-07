/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
//Others
import { motion } from "framer-motion"
import axios from 'axios'
//Icons
import { IconContext } from "react-icons";
import { CiUser } from 'react-icons/ci';
import { ArrowLongRightIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc'
import { IoLogoGoogle } from 'react-icons/io'
import 'react-tooltip/dist/react-tooltip.css'
import UseAnimations from 'react-useanimations';
import github from 'react-useanimations/lib/github'


const Login = ({ userName, setUserName, userPassword, setUserPassword, setUserEmail, setNoEmail, handleRegisterClick, settoEmailAuthentication, setLoading, setReference, handleSocialLogin }: { userName: string, setUserName: any, userPassword: string, setUserPassword: any, setUserEmail: any, setNoEmail: any, handleRegisterClick: any, settoEmailAuthentication: any, setLoading: any, setReference: any, handleSocialLogin: any }) => {

    const [userNameInputController, setUserNameInputController] = useState('')
    const [userPasswordInputController, setUserPasswordInputController] = useState('')
    const [inputIsFocused, setInputIsFocused] = useState('')
    const [response, setResponse] = useState<string>()
    const [ishovering, setIsHovering] = useState('')


    const authenticateUser = async () => {
        try {
            const apiResponse = await axios.post(`/server/api/authenticateUser`, { userName: userNameInputController, userPassword: userPasswordInputController });
            setResponse(apiResponse.data.message)
        } catch (error) {
            console.log(error);
        }
    };

    const checkEmail = async () => {
        const userEmail = await getUserEmail()
        if (userEmail) {
            setTimeout(() => {
                settoEmailAuthentication(true)
            }, 100);
        } else {
            setNoEmail(true)
        }
    }

    useEffect(() => {
        if (response === 'success') {
            checkEmail()
        } else {
            settoEmailAuthentication(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])

    const submitFunction = (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        setUserName(userNameInputController)
        setUserPassword(userPasswordInputController)
        authenticateUser()
    }

    const handleGithubLogin = async () => {
        handleSocialLogin('github', setLoading, setReference)
    }

    const handleGoogleLogin = async () => {
        handleSocialLogin('google', setLoading, setReference)
    }

    const getUserEmail = async () => {
        try {
            const response = await axios.post(`/server/api/getUserEmail`, { userName: userName, userPassword: userPassword });
            const data = response.data
            if (data) {
                setUserEmail(data)
                return data
            } else {
                setNoEmail(true)
            }
        } catch (error) {
            console.log(error);
            setUserEmail('')
        }
    }

    return (
        <motion.div className='flex flex-col justify-between items-center bg-white/30 backdrop-blur h-full px-4 rounded-3xl font-josefin '>
            <div className='mt-10'>
                <div className='flex justify-center items-center'>
                    <span className='text-[40px]'>
                        Login
                    </span>
                </div>
                <form onSubmit={submitFunction}>
                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userNameInputController != '' || inputIsFocused === 'userNameInputBar' ? 0 : 10 }} className={`flex mt-2 items-center px-2 border-2 border-transparent rounded-none ${response === 'success' ? 'border-b-[#4ade80]' : response === 'username or password incorrect' && userNameInputController ? 'border-b-red-500' : userNameInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userNameInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px]'}`}>
                        <div className=''>
                            <IconContext.Provider value={{ size: '25', color: response === 'success' ? '#4ade80' : response === 'username or password incorrect' && userNameInputController ? 'red' : userNameInputController ? '#2563eb' : inputIsFocused === 'userNameInputBar' ? '#734ae3' : 'black' }}>
                                <CiUser />
                            </IconContext.Provider>
                        </div>
                        <div className='ml-2'>
                            <input type="text" className={`px-2 py-2 font-alkatra bg-transparent focus:outline-none rounded-xl autofill:bg-black `} id='userNameInputField' placeholder='username' autoComplete='YourName' value={userNameInputController} onChange={(event) => setUserNameInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userNameInputBar')} onBlur={() => setInputIsFocused('')} />
                        </div>
                    </motion.div>

                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userPasswordInputController != '' || inputIsFocused === 'userPasswordInputBar' ? 0 : 10 }} className={`mt-4 flex items-center px-2 border-2 border-transparent rounded-none ${response === 'success' ? 'border-b-[#4ade80]' : response === 'username or password incorrect' && userPasswordInputController ? 'border-b-red-500' : userPasswordInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userPasswordInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px] '}`}>
                        <div className=''>
                            {response === 'success' ?
                                <LockOpenIcon className='w-6 text-green-400' />
                                :
                                <LockClosedIcon className='w-6' style={{ color: response === 'success' ? '#4ade80' : response === 'username or password incorrect' && userPasswordInputController ? 'red' : userPasswordInputController ? '#2563eb' : inputIsFocused === 'userPasswordInputBar' ? '#734ae3' : 'black' }} />}
                            {/* #ef4444 */}
                        </div>
                        <div className='ml-2'>
                            <input type={'password'} className={`px-2 py-2 font-alkatra bg-transparent focus:outline-none autofill:bg-black rounded-xl`} placeholder='password' autoComplete='Your Password' value={userPasswordInputController} onChange={(event) => setUserPasswordInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userPasswordInputBar')} onBlur={() => setInputIsFocused('')} />
                        </div>
                    </motion.div>

                    <div className='w-full flex justify-center items-center mt-4'>
                        <motion.button animate={{ width: ishovering === 'login' ? 120 : 70 }} type='submit' disabled={userNameInputController.length < 4 && userPasswordInputController.length < 8} className={`btn btn-primary !flex !justify-between !items-center !bg-gradient-to-br ${userNameInputController.length < 4 && userPasswordInputController.length < 8 ? 'from-red-200 to-red-500' : 'from-blue-200 to-blue-500 hover:from-green-200 hover:to-green-500'} hover:shadow-lg !border-none `} onMouseEnter={() => setIsHovering('login')} onMouseLeave={() => setIsHovering('')}>
                            <span>
                                Login
                            </span>
                            {ishovering === 'login' &&
                                <ArrowLongRightIcon className='w-5 ml-2' />}
                        </motion.button>
                    </div>
                </form>

                <div className='flex flex-col items-center w-full mt-4'>

                    <button className='!bg-white btn hover:shadow-lg rounded-lg w-1/2 mt-2 p-0 flex justify-center items-center' onMouseOver={() => setIsHovering('github')} onMouseOut={() => setIsHovering('')} onClick={handleGithubLogin}>
                        <div className='flex justify-center items-center py-0.5'>
                            <UseAnimations animation={github} loop={true} />
                            <span className='ml-1 mt-0.5'>
                                Github
                            </span>
                        </div>
                    </button>

                    <button className='bg-white btn hover:shadow-lg rounded-lg w-1/2 mt-2 p-0 flex justify-center items-center' onMouseOver={() => setIsHovering('google')} onMouseOut={() => setIsHovering('')} onClick={handleGoogleLogin}>
                        <div className='flex justify-center items-center py-0.5'>
                            {ishovering === 'google' ?
                                <FcGoogle />
                                :
                                <IoLogoGoogle />}
                            <span className='font-josefin mt-0.5'>
                                oogle
                            </span>
                        </div>
                    </button>
                </div>

                <div className='w-full flex justify-center items-center mt-5'>
                    <span>
                        Not a Member?
                    </span>
                    <button className='ml-2 text-selectedicon ' onClick={handleRegisterClick}>
                        Register
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default Login