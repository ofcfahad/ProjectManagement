import { Popconfirm } from 'antd'
import { LogoutOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { IconContext } from 'react-icons'
import { CiLogout } from 'react-icons/ci'
import { useApi, useProjectsData } from '../Contexts';
import Cookies from 'js-cookie';

export default function LogoutButton({ expand, handleLogout }: { expand: boolean, handleLogout: () => void }) {

    const { reset } = useProjectsData()
    const { logoutUser } = useApi()

    const Logout = async () => {
        if (Cookies.get('session') === 'loggedinasguestuser') {
            Cookies.remove('session')
            reset()
            handleLogout()
        } else
            if (await logoutUser()) {
                Cookies.remove('session')
                reset()
                handleLogout()
            }
    }

    return (
        <motion.div animate={{ width: expand ? 100 : 35 }} whileHover={{ width: expand ? 130 : 35, }} className={`${expand ? 'hover:bg-gradient-to-r hover:from-logoblue hover:via-logopink hover:to-logoyellow transition-colors ease-in-out delay-100 ' : 'bg-transparent'} w-[35%] rounded-full flex`}>
            <Popconfirm
                title="Logging Out"
                description="Are you sure you want to log out?"
                icon={<LogoutOutlined color='black' size={30} />}
                onConfirm={Logout}
                okButtonProps={{ ghost: true, danger: true }}
            >
                <button style={{ textDecoration: 'none' }} className='flex rounded-xl justify-evenly w-full items-end py-1 select-none' onClick={() => { }}>
                    <IconContext.Provider value={{ color: 'white', size: '25' }}>
                        <CiLogout />
                    </IconContext.Provider>
                    {
                        expand &&
                        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} exit={{ opacity: 0, x: -50 }} className={` text-white font-ubuntu `}>
                            Logout
                        </motion.span>
                    }
                </button>
            </Popconfirm>
        </motion.div>
    )
}
