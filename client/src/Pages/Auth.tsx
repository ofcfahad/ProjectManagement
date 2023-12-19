/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
//AppComponents
import {
  Login,
  EmailAuthentication,
  ForgotPassword,
  ResetPassword
} from '../components/Auth'
import LoggingLoading from '../components/LoggingLoading'
import { capitalize } from '../components/utils'
//OtherComponents
import Cookies from 'js-cookie'
//Assets
import { backgroundImage } from '../assets'
//Settings
import { disableSocialAuth } from '../../../developerSettings'
import { useUserData, useTheme, useProjectsData, useChats } from '../components/Contexts'
import { User } from '../components/Interfaces'

const Auth = ({ setUserLoggedIn }: { setUserLoggedIn: (loggedIn: boolean) => void }) => {

  const [userPassword, setUserPassword] = useState<string>('')
  const [userEmail, setUserEmail] = useState('')
  const [multiFactorAuthentication, setMultiFactorAuthentication] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetPassword, setresetPassword] = useState(false)

  const [authWindow, setAuthWindow] = useState<Window | null>(null)

  const { getUserDatafromDatabase } = useUserData()
  const { fetchProjectsDatafromDatabase } = useProjectsData()
  const { fetchChatsDatafromDatabase } = useChats()
  const { setTheme } = useTheme()

  //fetches userData by id from session token
  const fetchUser = async () => {
    setReference('main')
    setLoading(true)

    try {
      const localUserData: User = await getUserDatafromDatabase()

      if (localUserData.preferences && localUserData.preferences.theme) {
        setTheme(localUserData.preferences.theme)
      }

      if (localUserData._id != 'guestedId') {
        // get Projects
        await fetchProjectsDatafromDatabase()
        await fetchChatsDatafromDatabase()
      }

      return setUserLoggedIn(true)
    } catch (error) {
      setUserLoggedIn(false)
      console.error(error);
    }

    setReference('')
    setLoading(false)
  }

  const handleSocialLogin = async (ref: string, setLoading: (loading: boolean) => void, setReference: (ref: string) => void) => {
    if (disableSocialAuth) {
      return;
    }
    setReference(capitalize(ref));
    setLoading(true)

    setAuthWindow(window.open(`/server/api/auth/${ref}`, '_blank'))

    window.addEventListener('message', event => {
      if (event.origin === 'http://localhost:5000' && event.data.type === `${ref}-auth-success`) {
        Cookies.set('session', event.data.token)
        fetchUser()
        authWindow?.close()
      }
    })
  }

  const onLoadingBackArrowClick = () => {
    authWindow?.close()
    setLoading(false)
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
      if (Cookies.get('session')) {
        fetchUser()
      }
      setresetPassword(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`w-full flex flex-row`} style={{ height: window.innerHeight, backgroundImage: `url(${backgroundImage})` }} >
      {
        loading ?
          <LoggingLoading reference={reference} canPop={reference == 'main' ? false : true} onBackArrowClick={onLoadingBackArrowClick} />
          :
          <div className='w-full h-full flex flex-col items-center p-5'>

            <div className='w-1/2 h-[20%] flex justify-end'>
              <span className='text-[300%] font-alkatra'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </span>
            </div>

            <div className='w-[50%] h-[60%]'>
              <div className='w-full h-[5%]'>
                <button className='text-selectedicon float-right' onClick={handleGuestLoginClick} >
                  i am just exploring
                </button>
              </div>

              <div className='w-full h-[95%] flex justify-center items-center'>
                <div className='w-3/4 bg-white/10 p-4 backdrop-blur rounded-lg shadow-md'>

                  {
                    multiFactorAuthentication ?
                      <EmailAuthentication userPassword={userPassword} handleGoBackClick={() => setMultiFactorAuthentication(false)} userEmail={userEmail} fetchUser={fetchUser} />
                      :
                      resetPassword ?
                        <ResetPassword setResetPassword={setresetPassword} />
                        :
                        forgotPassword ?
                          <ForgotPassword setForgotPassword={setForgotPassword} />
                          :
                          <Login setMultiFactorAuthentication={setMultiFactorAuthentication} setUserPassword={setUserPassword} setLoading={setLoading} setReference={setReference} setUserEmail={setUserEmail} handleSocialLogin={handleSocialLogin} handleForgotPasswordClick={handleForgotPasswordClick} fetchUser={fetchUser} />
                  }

                </div>

              </div>

            </div>

          </div>
      }

    </div>
  )
}

export default Auth