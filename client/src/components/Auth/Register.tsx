/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
//App Components
import SocialLoginButtons from './SocialLoginButtons'
//Others
import { motion } from "framer-motion"
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { Divider } from 'antd'
//Icons
import registerIcon from '../../assets/icons/register.png'
import { IconContext } from "react-icons";
import { CiUser } from 'react-icons/ci';
import { ArrowLongRightIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const Register = ({ setLoading, setReference, handleLoginClick, settoEmailVerification, userName, setUserName, userPassword, setUserPassword, handleSocialLogin }: { setLoading: any, setReference: any, handleLoginClick: any, settoEmailVerification: any, userName: string, setUserName: any, userPassword: string, setUserPassword: any, handleSocialLogin: any }) => {

    const [userNameInputController, setUserNameInputController] = useState('')
    const [userPasswordInputController, setUserPasswordInputController] = useState('')
    const [inputIsFocused, setInputIsFocused] = useState('')
    const [buttonClicked, setButtonClicked] = useState(false)
    const [userAlreadyExists, setUserAlreadyExists] = useState<boolean>()
    const [ishovering, setIsHovering] = useState('')

    const handleRegisterClick = async () => {
        event?.preventDefault()
        setButtonClicked(true)
        setUserName(userNameInputController)
        setUserPassword(userPasswordInputController)
    }

    const handleRegistration = async () => {
        event?.preventDefault()

        try {
            const data = {
                userName: userName,
                userPassword: userPassword,
                fullName: '',
                userEmail: '',
                userProfilePicture: '',
                userGithubLink: ''
            }

            const response = await axios.post(`/server/api/register`, { user: data })
            const status = response.status

            if (status === 201) {
                settoEmailVerification(true)
                setUserAlreadyExists(false)
                return;
            }
            setUserAlreadyExists(true)
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setUserAlreadyExists(true)
            } else {
                console.log('from handleRegistration: ' + error)
            }
        }
    }

    useEffect(() => {
        if ((userName.length >= 4 && userPassword.length >= 8) && buttonClicked) {
            setUserAlreadyExists(false)
            setButtonClicked(false)
            handleRegistration()
        }
    }, [buttonClicked])

    return (
        <motion.div className='flex flex-col items-center h-full w-full px-4 rounded-3xl bg-white/30 backdrop-blur' >
            <div className='flex flex-col justify-center items-center mt-3'>
                <img src={registerIcon} alt="login" width={'100'} />
            </div>
            <form onSubmit={handleRegisterClick}>
                <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userNameInputController != '' || inputIsFocused === 'userNameInputBar' ? 0 : 10 }} className={`flex items-center px-2 border-2 border-transparent ${userAlreadyExists ? 'border-b-red-500' : userNameInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userNameInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white'}`} data-tooltip-id='usernameinputbar' >
                    <div className=''>
                        <IconContext.Provider value={{ size: '25', color: userAlreadyExists ? 'red' : userNameInputController ? '#2563eb' : inputIsFocused === 'userNameInputBar' ? '#734ae3' : 'black' }}>
                            <CiUser />
                        </IconContext.Provider>
                    </div>
                    <div className='ml-2'>
                        <input type="text" className={`px-2 py-2 bg-transparent focus:outline-none `} id='userNameInputField' placeholder='username' autoComplete='off' value={userNameInputController} onChange={(event) => setUserNameInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userNameInputBar')} onBlur={() => setInputIsFocused('')} />
                    </div>
                </motion.div>
                <Tooltip id='usernameinputbar' content={userAlreadyExists ? 'oops! Username is already taken' : ''} style={{ background: userAlreadyExists ? 'red' : '' }} />

                <motion.div initial={{ borderRadius: 0 }} animate={{ borderRadius: userPasswordInputController != '' || inputIsFocused === 'userPasswordInputBar' ? 0 : 10 }} className={`mt-4 flex items-center px-2 border-2 border-transparent ${userPasswordInputController != '' ? 'border-b-blue-600' : inputIsFocused === 'userPasswordInputBar' ? 'bg-transparent border-b-selectedicon' : 'bg-white'}`}>
                    <div>
                        {
                            userPasswordInputController.length >= 8 ?
                                <LockClosedIcon className='w-5 text-[#2563eb]' />
                                :
                                <LockOpenIcon className='w-5' style={{ color: userPasswordInputController ? '#2563eb' : inputIsFocused === 'userPasswordInputBar' ? '#734ae3' : 'black' }} />
                        }
                    </div>
                    <div className='ml-5'>
                        <input type={'password'} className={`py-2 focus:outline-none `} placeholder='password' autoComplete='off' value={userPasswordInputController} onChange={(event) => setUserPasswordInputController(event?.target?.value ?? '')} onFocus={() => setInputIsFocused('userPasswordInputBar')} onBlur={() => setInputIsFocused('')} />
                    </div>
                </motion.div>

                <div className='w-full flex justify-center items-center mt-4'>
                    <motion.button animate={{ width: ishovering === 'register' ? 120 : 80 }} type='submit' disabled={userNameInputController.length < 4 || userPasswordInputController.length < 8} className={`btn btn-primary !flex !justify-between !items-center !bg-gradient-to-br ${userNameInputController.length < 4 && userPasswordInputController.length < 8 ? 'from-red-200 to-red-500' : 'from-blue-200 to-blue-500 hover:from-green-200 hover:to-green-500'} hover:shadow-lg !border-none `} onMouseEnter={() => setIsHovering('register')} onMouseLeave={() => setIsHovering('')} >
                        <span>
                            Register
                        </span>
                        {
                            ishovering === 'register' &&
                            <ArrowLongRightIcon className='w-5 ml-2' />
                        }
                    </motion.button>
                </div>
            </form>

            <Divider> <span className='text-xs'> or Authenticate with </span> </Divider>

            <SocialLoginButtons setLoading={setLoading} setReference={setReference} handleSocialLogin={handleSocialLogin} />

            <div className='w-full flex justify-center items-center mt-4 font-mono'>
                <span>
                    Already a Member?
                </span>
                <button className='ml-2 text-selectedicon' onClick={handleLoginClick} >
                    Login
                </button>
            </div>

        </motion.div>
    )
}

export default Register