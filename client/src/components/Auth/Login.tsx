import { useState } from 'react'
//App Components
import SocialLoginButtons from './SocialLoginButtons';
import { useApi } from '../Contexts';
//Others
import { motion } from "framer-motion"
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { Divider } from 'antd';
import Cookies from 'js-cookie';
//Icons
import { IconContext } from "react-icons";
import { CiUser } from 'react-icons/ci';
import { ArrowLongRightIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading'

const Login = ({ setUserPassword, setUserEmail, setMultiFactorAuthentication, setLoading, setReference, handleSocialLogin, handleForgotPasswordClick, fetchUser }: { setUserPassword: (password: string) => void, setUserEmail: (userEmail: string) => void, setMultiFactorAuthentication: (toEmailAuth: boolean) => void, setLoading: (loading: boolean) => void, setReference: (reference: string) => void, handleSocialLogin: (ref: string, setLoading: (loading: boolean) => void, setReference: (ref: string) => void) => void, handleForgotPasswordClick: () => void, fetchUser: () => void }) => {

    const [userNameInputController, setUserNameInputController] = useState('')
    const [userPasswordInputController, setUserPasswordInputController] = useState('')
    const [userAlreadyExists, setUserAlreadyExists] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)
    const [inputIsFocused, setInputIsFocused] = useState('')
    const [response, setResponse] = useState<string>()
    const [isHovering, setisHovering] = useState('')

    const [loginOrRegister, setLoginOrRegister] = useState(true)

    const { authenticateUser, registerUser, sendOTP } = useApi()

    const AuthenticateUser = async () => {
        const response = await authenticateUser(userNameInputController, userPasswordInputController)
        if (response.message === 'success') {
            setResponse('success')
            if (response.mfa && response.email) {
                setUserEmail(response.email)
                if (await sendOTP(response.email)) {
                    setMultiFactorAuthentication(true)
                }
            } else {
                const token = response.token
                if (token) {
                    Cookies.set('session', token, { expires: 7 })
                }
                fetchUser()
            }
        } else {
            setResponse('username or password incorrect')
        }
    };

    const RegisterUser = async () => {
        const response = await registerUser(userNameInputController, userPasswordInputController)

        if (response.message === 'conflict') {
            setResponse('conflict')
            setUserAlreadyExists(true)
            return
        }
        if (response.token) {
            setResponse('success')
            setUserAlreadyExists(false)
            Cookies.set('session', response.token, { expires: 7 })
            fetchUser()
        }
    }

    const submitFunction = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        if ((userNameInputController.length < 4 && userPasswordInputController.length < 8)) {
            return
        }
        setUserPassword(userPasswordInputController)
        setLoginLoading(true)
        loginOrRegister ? await AuthenticateUser() : await RegisterUser()
        setLoginLoading(false)
    }

    return (
        <motion.div className='flex flex-col items-center h-full w-full gap-4'>
            <div className='h-[20%] flex justify-center items-center gap-2 w-full'>
                <div className='w-1/2 relative bg-gray-600/20 rounded-xl'>
                    <motion.div
                        animate={{ x: !loginOrRegister ? '100%' : 0 }}
                        className='w-1/2 h-[40px] rounded-xl absolute bg-white/30 z-0'
                    />
                    <div className='flex items-center gap-2 text-white rounded-xl'>
                        <button
                            className={`w-1/2 p-2 flex justify-center items-center rounded-xl z-10`}
                            onClick={() => {
                                setLoginOrRegister(true)
                                setResponse('')
                                setUserAlreadyExists(false)
                            }}
                        >
                            Login
                        </button>
                        <button
                            className={`w-1/2 p-2 flex justify-center items-center rounded-xl z-10`}
                            onClick={() => {
                                setLoginOrRegister(false)
                                setResponse('')
                                setUserAlreadyExists(false)
                            }}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
            <div className='h-[80%] w-full'>
                <form onSubmit={submitFunction} className='flex flex-col gap-3'>

                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userNameInputController != '' || inputIsFocused === 'userNameInputBar' ? 0 : 10 }} className={`flex w-1/2 self-center items-center px-2 border-2 border-transparent rounded-none ${response === 'success' ? 'border-b-[#4ade80]' : response === 'username or password incorrect' || userAlreadyExists && userNameInputController ? 'border-b-red-500' : userNameInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userNameInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px]'}`} data-tooltip-id='usernameinputbar'>
                        <div className=''>
                            <IconContext.Provider value={{ size: '25', color: response === 'success' ? '#4ade80' : response === 'username or password incorrect' || userAlreadyExists && userNameInputController ? 'red' : userNameInputController ? '#2563eb' : inputIsFocused === 'userNameInputBar' ? '#734ae3' : 'black' }}>
                                <CiUser />
                            </IconContext.Provider>
                        </div>
                        <div className='ml-2'>
                            <input type="text" className={`px-2 py-2 bg-transparent focus:outline-none rounded-xl autofill:bg-black `} placeholder='username' autoComplete={loginOrRegister ? 'username' : 'off'} value={userNameInputController} onChange={(event) => {
                                setUserNameInputController(event?.target?.value ?? '')
                                if (userNameInputController.length <= 1) {
                                    setUserAlreadyExists(false)
                                    setResponse(undefined)
                                }
                            }} onFocus={() => setInputIsFocused('userNameInputBar')} onBlur={() => setInputIsFocused('')} />
                        </div>
                    </motion.div>
                    <Tooltip id='usernameinputbar' content={response === 'username or password incorrect' ? 'oops! username or password incorrect' : !loginOrRegister && userAlreadyExists && response === 'conflict' ? 'Username already exists' : ''} style={{ background: response === 'username or password incorrect' || !loginOrRegister && response === 'conflict' && userAlreadyExists ? 'red' : '' }} />

                    <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userPasswordInputController != '' || inputIsFocused === 'userPasswordInputBar' ? 0 : 10 }} className={`flex w-1/2 self-center items-center px-2 border-2 border-transparent rounded-none ${response === 'success' ? 'border-b-[#4ade80]' : response === 'username or password incorrect' && userPasswordInputController ? 'border-b-red-500' : userPasswordInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userPasswordInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white rounded-[8px] '}`}>
                        <div className=''>
                            {
                                response === 'success' ?
                                    <LockOpenIcon className='w-6 text-green-400' />
                                    :
                                    <LockClosedIcon className='w-6' style={{ color: response === 'success' ? '#4ade80' : response === 'username or password incorrect' && userPasswordInputController ? 'red' : userPasswordInputController ? '#2563eb' : inputIsFocused === 'userPasswordInputBar' ? '#734ae3' : 'black' }} />}
                        </div>
                        <div className='ml-2'>
                            <input type={'password'} className={`px-2 py-2 bg-transparent focus:outline-none autofill:bg-black rounded-xl`} placeholder='password' autoComplete={loginOrRegister ? 'current-password' : 'new-password'} value={userPasswordInputController} onChange={(event) => setUserPasswordInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userPasswordInputBar')} onBlur={() => setInputIsFocused('')} />
                        </div>
                    </motion.div>

                    {
                        response === 'username or password incorrect' &&
                        <div className='w-full flex justify-center items-center text-xs font-mono'>
                            <span>
                                Forgot Password?
                            </span>
                            <button className='ml-2 text-selectedicon ' onClick={handleForgotPasswordClick}>
                                Reset
                            </button>
                        </div>
                    }

                    <div className={`w-full flex justify-center items-center`}>
                        <motion.button animate={{ width: isHovering === 'login' || loginLoading ? 150 : loginOrRegister ? 75 : 90 }} type='submit' disabled={userNameInputController.length < 4 || userPasswordInputController.length < 8 || loginLoading} className={`flex justify-between items-center py-2 px-3 rounded-full bg-gradient-to-br ${loginLoading ? 'from-green-200 to-green-500' : userNameInputController.length < 4 && userPasswordInputController.length < 8 ? 'from-red-200 to-red-500' : 'from-blue-200 to-blue-500 hover:from-green-200 hover:to-green-500'} hover:shadow-lg border-none focus:outline-none text-white`} onMouseEnter={() => setisHovering('login')} onMouseLeave={() => setisHovering('')}>
                            <span className=''>
                                {
                                    loginOrRegister ?
                                        'Login'
                                        :
                                        'Register'
                                }
                            </span>
                            {
                                loginLoading ?
                                    <UseAnimations animation={loading} strokeColor='white' />
                                    :
                                    <ArrowLongRightIcon className='w-5' />
                            }
                        </motion.button>
                    </div>
                </form>

                <Divider className='h-5'> <span className='text-xs'> or Authenticate with </span> </Divider>

                <div className='w-full flex justify-center items-center'>
                    <SocialLoginButtons setLoading={setLoading} setReference={setReference} handleSocialLogin={handleSocialLogin} />
                </div>

            </div>
        </motion.div>
    )
}

export default Login