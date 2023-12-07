/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
//AppComponents
import LogoutButton from './LogoutButton';
//OtherComponents
import { motion } from 'framer-motion';
//Assets
import { appLogo } from '../../assets'
//Icons
import { IconContext } from "react-icons";
import { CiHome, CiMail, CiSettings } from 'react-icons/ci'
import { HiOutlineRectangleStack, HiOutlineUser } from 'react-icons/hi2';
import { useSidebar } from '../Contexts';

const Navbar = ({ menuTransitionDuration, handleLogout }: { menuTransitionDuration: number, handleLogout: () => void }) => {

    const url = window.location.pathname
    const [selectedIcon, setSelectedIcon] = useState(url)

    const { expand } = useSidebar()

    const navigationLinks = [
        {
            title: 'Home',
            icon: <CiHome />,
            link: '/',
        },
        {
            title: 'Profile',
            icon: <HiOutlineUser />,
            link: '/profile',
        },
        {
            title: 'Mails',
            icon: <CiMail />,
            link: '/messages',
        },
        {
            title: 'Tasks',
            icon: <HiOutlineRectangleStack />,
            link: '/tasks',
        },
        {
            title: 'Settings',
            icon: <CiSettings />,
            link: '/settings',
        },
    ]


    return (
        <motion.div initial={{ width: 0 }} animate={{ width: expand ? 200 : 100 }} transition={{ duration: menuTransitionDuration || 0.5 }} className={`bg-sidebarcolor h-full w-full fixed`} >

            <div className='w-full h-[10%] flex justify-center items-center'>
                <motion.div initial={{ width: 0 }} animate={{ width: expand ? 60 : 50 }} >
                    <NavLink style={{ textDecoration: 'none' }} to='/' className={` flex justify-center items-center select-none`} >
                        <motion.img animate={{ rotate: expand ? 180 : 0, scale: expand ? 1.2 : 1 }} transition={{ duration: 0.5 }} src={appLogo} alt="To Do App" className={` select-none `} onClick={() => setSelectedIcon('/')} />
                    </NavLink>
                </motion.div>
            </div>

            {/* ICONS/LINKS */}
            <div className='w-full h-[80%] flex justify-center pt-20'>
                <ul className={`px-0 text-sm text-left flex flex-col justify-between ${window.innerHeight >= 700 ? 'h-[50%]' : 'h-[60%]'} w-full select-none`}>
                    <IconContext.Provider value={{ color: 'white', size: '25' }} >
                        {
                            navigationLinks.map((link) => (
                                <motion.li key={link.title} className={`flex justify-center`} >
                                    <motion.div animate={{ width: expand ? 100 : 35 }} whileHover={{ width: expand ? 130 : 35, }} className={`${selectedIcon === link.link ? 'bg-selectedicon hover:bg-opacity-70' : expand ? 'flex justify-center hover:bg-gradient-to-r hover:from-logoblue hover:via-logopink hover:to-logoyellow transition-colors ease-in-out delay-100 ' : 'bg-transparent'} rounded-full flex`} >
                                        <NavLink style={{ textDecoration: 'none' }} to={link.link} className='flex rounded-full justify-evenly items-center w-full h-full p-1 font-ubuntu' onClick={() => setSelectedIcon(link.link)}>
                                            {link.icon}
                                            {expand && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} exit={{ opacity: 0, x: -50 }} className={` text-white font-ubuntu text-[16px] `}> {link.title} </motion.span>}
                                        </NavLink>
                                    </motion.div>
                                </motion.li>
                            ))
                        }
                    </IconContext.Provider>
                </ul >
            </div >

            {/* LOGOUT */}
            <motion.div className={`h-[10%] w-full flex justify-center items-center`}>
                <LogoutButton expand={expand} handleLogout={handleLogout} />
            </motion.div>

        </motion.div >
    )
}

export default Navbar