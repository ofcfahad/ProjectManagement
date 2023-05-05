import React, { useState } from 'react'
//AppComponents
import {
  Login,
  Register,
  EmailVerification,
  EmailAuthentication
} from '../components'
//OtherComponents
import { AnimatePresence, motion } from 'framer-motion'
//Assets
import { appHomePage, backgroundImage } from '../assets'
//Icons

import UseAnimations from 'react-useanimations'
import arrow from 'react-useanimations/lib/arrowUp'
import LoggingLoading from '../components/LoggingLoading'
import Cookies from 'js-cookie'

const LoginPage = ({ setUserLoggedIn }) => {

  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState<string>()
  const [userEmail, setUserEmail] = useState('')
  const [noEmail, setNoEmail] = useState(false)
  const [loginOrRegister, setLoginOrRegister] = useState(true)
  const [toEmailVerification, settoEmailVerification] = useState(false)
  const [toEmailAuthentication, settoEmailAuthentication] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')

  const handleArrowIconClick = () => {
    const userNameInputBar = document.getElementById('userNameInputField')
    if (userNameInputBar) {
      userNameInputBar.focus()
    } else null
  }

  function Capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSocialLogin = async (ref: string, setLoading: Function, setReference: Function) => {
    await setReference(Capitalize(ref));
    setLoading(true)
    const authWindow = window.open(`http://localhost:5000/api/auth/${ref}`, '_blank')
    window.addEventListener('message', event => {
      if (event.origin === 'http://localhost:5000' && event.data.type === `${ref}-auth-success`) {
        Cookies.set('session', event.data.token)
        setUserLoggedIn(true)
        setLoading(false)
        authWindow?.close()
      }
    })
  }

  return (
    <div className={`w-full flex flex-row `} style={{ height: window.innerHeight, backgroundImage: `url(${backgroundImage})` }} >
      {
        loading ?
          <LoggingLoading reference={reference} setLoading={setLoading} />
          :
          <div className='w-full h-full flex'>
            <div className=' w-1/2 flex flex-col justify-between px-5 py-5 '>
              <span className='text-[300%] font-alkatra'>
                Manage Your Projects Effeciently and Productively
              </span>
              <div className='w-full flex justify-between items-center'>
                <span className='font-alkatra text-[100%]'>
                  So Join Us like Right Now
                </span>
                <UseAnimations animation={arrow} className='rotate-90 cursor-pointer' onClick={handleArrowIconClick} />
              </div>
              <img src={appHomePage} alt="" className=' w=[100%] rounded-3xl' />
            </div>

            <motion.div
              className={`w-1/2 h-full flex flex-col font-josefin`}
            >
              <div className='h-[5%] flex items-center justify-end m-4'>
                <button className='text-selectedicon h-5' onClick={() => setLoginOrRegister(!loginOrRegister)} >
                  i am just exploring
                </button>
              </div>
              <div className='w-full h-[95%] flex justify-center items-center'>
                <motion.div className='w-[300px] h-[500px] bg-transparent rounded-2xl' >
                  {
                    loginOrRegister ?

                      (
                        toEmailAuthentication && userEmail ?
                          <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: -100 }} className='h-full w-full' >
                            <EmailAuthentication userName={userName} userPassword={userPassword} handleGoBackClick={() => settoEmailAuthentication(false)} userEmail={userEmail} setUserLoggedIn={setUserLoggedIn} />
                          </motion.div>
                          :
                          noEmail ?
                            <motion.div initial={{ x: 200 }} animate={{ x: 0 }} className='h-full w-full' >
                              <EmailVerification userName={userName} settoEmailVerification={settoEmailVerification} userPassword={userPassword} setUserName={setUserName} setUserPassword={setUserPassword} setNoEmail={setNoEmail} setUserLoggedIn={setUserLoggedIn} />
                            </motion.div>
                            :
                            <AnimatePresence>
                              <motion.div initial={{ x: 200 }} animate={{ x: 0 }} exit={{ x: -100 }} className='h-full w-full' >
                                <Login userName={userName} setUserName={setUserName} handleRegisterClick={() => setLoginOrRegister(false)} settoEmailAuthentication={settoEmailAuthentication} userPassword={userPassword} setUserPassword={setUserPassword} setLoading={setLoading} setReference={setReference} userEmail={userEmail} setUserEmail={setUserEmail} setNoEmail={setNoEmail} handleSocialLogin={handleSocialLogin} />
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




{/* <Transition appear show={openWelcomeModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setOpenWelcomeModal(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className=" max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Welcome Back {userName}
                    </Dialog.Title>

                    <div className="mt-4 flex justify-center items-center">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setOpenWelcomeModal(false)}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition> */}