/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react"
import { Routes, Route } from 'react-router-dom'
//AppComponents
import { Sidebar, UnSupportedScreen } from './components'
import { Home, Auth, Messages, Profile, Settings, Tasks } from './Pages'
import { useSidebar, useTheme } from "./components/Contexts"
//OtherComponents
import { motion } from "framer-motion"

function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false)

  const { theme } = useTheme()
  const { expand } = useSidebar()

  const menuTransitionDuration = 0

  // logouts the user
  const handleLogout = () => {
    setUserLoggedIn(false)
  }


  return (
    <div className={` h-[100vh] ${theme === 'dark' ? 'bg-[#8799A3]' : 'bg-[#f2f6fe]'} font-josefin`}>
      {
        !userLoggedIn ?
          <Auth setUserLoggedIn={setUserLoggedIn} />
          : window.innerWidth <= 720 ? // not designed for mobile or small devices
            <UnSupportedScreen />
            :
            //MainApp
            <motion.div className="w-full h-full flex">
              <Sidebar handleLogout={handleLogout} menuTransitionDuration={menuTransitionDuration} />
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
  )
}

export default App