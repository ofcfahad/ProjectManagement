/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
//AppComponents
import { Confirmation } from './Popups';
//OtherComponents
import { motion } from 'framer-motion';
//Assets
import { appLogo } from '../assets/'
//Icons
import { IconContext } from "react-icons";
import { CiHome, CiLogout, CiMail, CiSettings } from 'react-icons/ci'
import { HiOutlineRectangleStack, HiOutlineUser } from 'react-icons/hi2';

const Navbar = ({ expand, menuTransitionDuration, handleLogout }: { expand: boolean, menuTransitionDuration: number, handleLogout: any }) => {

    const url = window.location.pathname
    const [selectedIcon, setSelectedIcon] = useState(url)
    const [openLogoutConfirmation, setOpenLogoutConfirmation] = useState(false)

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
        <motion.div initial={{ width: 0 }} animate={{ width: expand ? 300 : 100 }} transition={{ duration: menuTransitionDuration || 0.5 }} className={`bg-sidebarcolor h-full w-full fixed font-josefin`} >

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
                                        <NavLink style={{ textDecoration: 'none' }} to={link.link} className='flex rounded-xl justify-evenly items-center w-full h-full py-1' onClick={() => setSelectedIcon(link.link)}>
                                            {link.icon}
                                            {expand && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} exit={{ opacity: 0, x: -50 }} className={` text-white mt-[5px] `}> {link.title} </motion.span>}
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
                <Confirmation
                    button={
                        <motion.div animate={{ width: expand ? 100 : 35 }} whileHover={{ width: expand ? 130 : 35, }} className={`${expand ? 'hover:bg-gradient-to-r hover:from-logoblue hover:via-logopink hover:to-logoyellow transition-colors ease-in-out delay-100 ' : 'bg-transparent'} w-[35%] rounded-full flex`}>
                            <button style={{ textDecoration: 'none' }} className='flex rounded-xl justify-evenly w-full items-end py-1 select-none' onClick={() => setOpenLogoutConfirmation(true)}>
                                <IconContext.Provider value={{ color: 'white', size: '25' }}>
                                    <CiLogout />
                                </IconContext.Provider>
                                {expand &&
                                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} exit={{ opacity: 0, x: -50 }} className={` text-white text-sm `}>
                                        Logout
                                    </motion.span>
                                }
                            </button>
                        </motion.div>
                    }
                    isOpen={openLogoutConfirmation} onClose={() => setOpenLogoutConfirmation(false)}
                    customSubmitButton={handleLogout} customSubmitButtonTitle={'yeah Log it Out!'} title={'you Sure?'} description={''}
                />
            </motion.div>

        </motion.div >
    )
}

export default Navbar