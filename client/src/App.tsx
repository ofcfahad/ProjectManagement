/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Routes, Route } from 'react-router-dom'
//AppComponents
import { Navbar, UnSupportedScreen, LoggingLoading } from './components'
import { Home, LoginPage, Messages, Profile, Settings, Tasks } from './Pages'
//OtherComponents
import { motion } from "framer-motion"
import axios from "axios"
import Cookies from 'js-cookie'
import { fetchProjectsData } from "./components/Home/functions"
import { useProjectsData } from "./components/Contexts/Project/useProjectsData"
import { User } from "./components/interfaces"
import { useUserData } from "./components/Contexts/User/useUserContext"
import { useSidebarContext } from "./components/Contexts/SideBar/useSidebarContext"
import { useThemeContext } from "./components/Contexts/Theme/useThemeContext"
import { useGuestContext } from "./components/Contexts/User/GuestContext"

function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false) // Loading used mostly while fetching Data
  const [width, setWidth] = useState(window.innerWidth) // debugging

  const { setProjectsData } = useProjectsData()
  const { setUserData } = useUserData()
  const { setIsGuest, guestData } = useGuestContext()
  const { theme, setTheme } = useThemeContext()
  const { expand } = useSidebarContext()

  const menuTransitionDuration = 0
  const session = Cookies.get('session') // get's token from session cookie 

  //fetches userData by id from session token
  const fetchUser = async () => {
    setLoading(true)
      if (session == 'loggedinasguestuser') {
        setIsGuest(true)
        setUserData(guestData)
        setTheme(guestData.preferences.theme)
        setUserLoggedIn(true)
      } else {
        try {
          const response = await axios.post(`/server/api/getUserData`, { token: session })
          if (response.data != 'invalid token') {
            const localUserData: User = response.data
            setUserData(localUserData)
            setTheme(localUserData.preferences.theme)

            if (localUserData._id != 'guestedId') {
              const data = await fetchProjectsData(localUserData._id, session??'')
              setProjectsData(data)
            }
            setLoading(false)
            return setUserLoggedIn(true)

          } else {
            setUserLoggedIn(false)
            Cookies.set('session', '')
            setLoading(false)
            console.error('Invalid Session Cookie')
          }
        } catch (error) {
          setUserLoggedIn(false)
          console.error(error);
        }
      }
    setLoading(false)
  }

  // logouts the user
  const handleLogout = async () => {
    Cookies.remove('session')
    setProjectsData([])
    setUserLoggedIn(false)
  }

  // get's width. debugging
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  // runs the fetchUser function when userLoggedIn or session changes
  useEffect(() => {
    if (session) {
      fetchUser()
    }
  }, [session])

  return (
    <>

      <div className={` h-[100vh] ${theme === 'dark' ? 'bg-[#4c5e81]' : 'bg-[#f2f6fe]'} font-josefin`}>

        {
          loading ?
            <LoggingLoading reference={'main'} setLoading={undefined} />
            :
            !userLoggedIn ?
              <LoginPage setUserLoggedIn={setUserLoggedIn} />
              : width <= 720 ? // not designed for mobile or small devices
                <UnSupportedScreen />
                :
                //MainApp
                <motion.div className="w-full h-full flex">
                  <Navbar handleLogout={handleLogout} menuTransitionDuration={menuTransitionDuration} />
                  <motion.div animate={{ width: '100%', marginLeft: expand ? 200 : 100 }} transition={{ duration: menuTransitionDuration || 0.5, ease: "easeInOut" }} >
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                  </motion.div>
                </motion.div>
        }
      </div>

    </>
  )
}

export default App