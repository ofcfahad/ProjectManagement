/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
//AppComponents
import {
  Login,
  Register,
  EmailVerification,
  EmailAuthentication,
  ForgotPassword,
  ResetPassword
} from '../components/Auth'
import LoggingLoading from '../components/LoggingLoading'
import { capitalize } from '../components/functions'
//OtherComponents
import { AnimatePresence, motion } from 'framer-motion'
import Cookies from 'js-cookie'
//Assets
import { appHomePage, backgroundImage } from '../assets'
//Icons
import UseAnimations from 'react-useanimations'
import arrow from 'react-useanimations/lib/arrowUp'
//Settings
import { disableSocialAuth } from '../../../developerSettings'

const LoginPage = ({ setUserLoggedIn }: { setUserLoggedIn: any }) => {

  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [userEmail, setUserEmail] = useState('')
  const [noEmail, setNoEmail] = useState(false)
  const [loginOrRegister, setLoginOrRegister] = useState(true)
  const [toEmailVerification, settoEmailVerification] = useState(false)
  const [toEmailAuthentication, settoEmailAuthentication] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetPassword, setresetPassword] = useState(false)

  const handleArrowIconClick = () => {
    const userNameInputBar = document.getElementById('userNameInputField')
    if (userNameInputBar) {
      userNameInputBar.focus()
    } else null
  }

  const handleSocialLogin = async (ref: string, setLoading: any, setReference: any) => {
    if (disableSocialAuth) {
      return;
    }
    await setReference(capitalize(ref));
    setLoading(true)

    const authWindow = window.open(`/server/api/auth/${ref}`, '_blank')
    window.addEventListener('message', event => {
      if (event.origin === 'http://localhost:5000' && event.data.type === `${ref}-auth-success`) {
        Cookies.set('session', event.data.token)
        setUserLoggedIn(true)
        setLoading(false)
        authWindow?.close()
      }
    })
  }

  const handleForgotPasswordClick = () => {
    setForgotPassword(true)
  }

  const handleGuestLoginClick = async () => {
    event?.preventDefault()
    try {
      Cookies.set('session', 'loggedinasguestuser', { expires: 1 })
      setUserLoggedIn(true)
    } catch (error) {
      console.log(`from handleGuestLoginClick: ${error}`);
    }
  }


  useEffect(() => {
    if (window.location.pathname == '/reset') {
      setresetPassword(true)
    } else {
      setresetPassword(false)
    }
  }, [])

  return (
    <div className={`w-full flex flex-row`} style={{ height: window.innerHeight, backgroundImage: `url(${backgroundImage})` }} >
      {
        loading ?
          <LoggingLoading reference={reference} setLoading={setLoading} />
          :
          <div className='w-full h-full flex'>
            <div className=' w-1/2 flex flex-col justify-between px-5 py-5 '>
              <span className='text-[300%] font-alkatra'>
                some fancy marketing quote
              </span>
              <div className='w-full flex justify-between items-center'>
                <span className='font-alkatra text-[100%]'>
                  So Join Us like Right Now
                </span>
                <UseAnimations animation={arrow} className='rotate-90 cursor-pointer' onClick={handleArrowIconClick} />
              </div>
              <img src={appHomePage} alt="App Home Page" className=' w=[100%] rounded-3xl' />
            </div>

            <motion.div
              className={`w-1/2 h-full flex flex-col`}
            >
              <div className='h-[5%] flex items-center justify-end m-4'>
                <button className='text-selectedicon h-5' onClick={handleGuestLoginClick} >
                  i am just exploring
                </button>
              </div>
              <div className='w-full h-[95%] flex justify-center items-center'>
                <motion.div className='w-[300px] h-[500px] bg-transparent rounded-2xl' >
                  {
                    resetPassword ?
                      <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: -100 }} className='h-full w-full' >
                        <ResetPassword setResetPassword={setresetPassword} />
                      </motion.div>
                      : forgotPassword ?
                        <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: -100 }} className='h-full w-full' >
                          <ForgotPassword setForgotPassword={setForgotPassword} />
                        </motion.div>
                        :
                        loginOrRegister ?

                          (
                            toEmailAuthentication && userEmail ?
                              <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: -100 }} className='h-full w-full' >
                                <EmailAuthentication userPassword={userPassword} handleGoBackClick={() => settoEmailAuthentication(false)} userEmail={userEmail} setUserLoggedIn={setUserLoggedIn} />
                              </motion.div>
                              :
                              noEmail ?
                                <motion.div initial={{ x: 200 }} animate={{ x: 0 }} className='h-full w-full' >
                                  <EmailVerification userName={userName} settoEmailVerification={settoEmailVerification} userPassword={userPassword} setUserName={setUserName} setUserPassword={setUserPassword} setNoEmail={setNoEmail} setUserLoggedIn={setUserLoggedIn} />
                                </motion.div>
                                :
                                <AnimatePresence>
                                  <motion.div initial={{ x: 200 }} animate={{ x: 0 }} exit={{ x: -100 }} className='h-full w-full' >
                                    <Login userName={userName} setUserName={setUserName} handleRegisterClick={() => setLoginOrRegister(false)} settoEmailAuthentication={settoEmailAuthentication} userPassword={userPassword} setUserPassword={setUserPassword} setLoading={setLoading} setReference={setReference} setUserEmail={setUserEmail} setNoEmail={setNoEmail} handleSocialLogin={handleSocialLogin} handleForgotPasswordClick={handleForgotPasswordClick} />
                                  </motion.div>
                                </AnimatePresence>
                          )
                          :
                          !loginOrRegister ?
                            (
                              toEmailVerification ?
                                <motion.div initial={{ x: 200 }} animate={{ x: 0 }} className='h-full w-full' >
                                  <EmailVerification userName={userName} settoEmailVerification={settoEmailVerification} userPassword={userPassword} setUserName={setUserName} setUserPassword={setUserPassword} setNoEmail={setNoEmail} setUserLoggedIn={setUserLoggedIn} />
                                </motion.div>
                                :
                                <motion.div initial={{ x: 200 }} animate={{ x: 0 }} className='h-full w-full' >
                                  <Register setLoading={setLoading} handleLoginClick={() => setLoginOrRegister(true)} settoEmailVerification={settoEmailVerification} userName={userName} setUserName={setUserName} userPassword={userPassword} setUserPassword={setUserPassword} setReference={setReference} handleSocialLogin={handleSocialLogin} />
                                </motion.div>
                            )
                            :
                            null
                  }
                </motion.div>
              </div>
            </motion.div>
          </div>
      }

    </div>
  )
}

export default LoginPage