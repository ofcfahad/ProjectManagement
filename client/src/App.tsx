import React, { useEffect, useState } from "react"
import { Routes, Route, useLoaderData } from 'react-router-dom'
//AppComponents
import { Navbar, UnSupportedScreen, LoggingLoading } from './components'
import { Home, LoginPage, Messages, Profile, Settings, Tasks } from './Pages'
//OtherComponents
import { motion } from "framer-motion"
import axios from "axios"
import Cookies from 'js-cookie'

function App() {

  //interface for User
  interface User {
    _id: any,
    userName: string,
    fullName: string,
    userEmail: string,
    userProfilePicture: string,
    verified: Boolean
  }

  const [userData, setUserData] = useState<User>()
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [expand, setExpand] = useState(false) // for SideBar 
  const [loading, setLoading] = useState(false) // well Loading used mostly while fetching Data
  const [toolTipisVisible, settoolTipisVisible] = useState(false) // later
  const [width, setWidth] = useState(window.innerWidth) // debugging
  const [guestLoggedIn, setGuestLoggedIn] = useState(true) // for guests
  const [menuTransitionDuration, setMenuTransitionDuration] = useState(undefined) // the transition duration for SideBar expand and unexpand

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

  const session = Cookies.get('session') // get's token from session cookie 

  //fetches userData by id from session token
  const fetchUser = async () => {
    setLoading(true)
    if (session) {
      const response = await axios.post('http://localhost:5000/api/getUserData', { token: session })
      setUserData(response.data)
    }
    setLoading(false)
  }


  // runs the fetchUser function when userLoggedIn or session changes
  useEffect(() => {
    if (session) {
      fetchUser()
    }
  }, [userLoggedIn])


  // well logouts the user
  const handleLogout = () => {
    Cookies.set('session', '')
    setUserData(undefined)
    setUserLoggedIn(false)
  }

  return (
    <>

      <div className={` h-[100vh] bg-[#f2f6fe] `}  >

        {
          loading ?
            <LoggingLoading reference={'main'} setLoading={undefined} />
            :
            !userData ?
              <LoginPage setUserLoggedIn={setUserLoggedIn} />
              : width <= 720 ? // app wouldn't look good on mobile
                <UnSupportedScreen />
                :
                //MainApp
                <motion.div className="w-full h-full flex fixed">
                  <Navbar expand={expand} handleLogout={handleLogout} menuTransitionDuration={undefined} />
                  <motion.div animate={{ width: '100%' }} transition={{ duration: menuTransitionDuration || 0.5, ease: "easeInOut" }} >
                    <Routes>
                      <Route path="/" element={<Home expand={expand} setExpand={setExpand} toolTipisVisible={toolTipisVisible} userData={userData} />} />
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
