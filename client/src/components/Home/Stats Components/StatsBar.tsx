/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion'
import { IconContext } from 'react-icons'
import { HiOutlineUser } from 'react-icons/hi2'
import DashboardCircularProgressBar from './DashboardCircularProgressBar'

const StatsBar = (props: any) => {

    const { notificationBar, bgColor, projectsDataLength, ongoingProjects, projectsInfo, isHovered, setIsHovered } = props

    const handleStatsBarClick = (id: string) => () => {
        if (isHovered === id) {
            return setIsHovered('')
        }
        setIsHovered(id)
    }

    return (
        <motion.div initial={{ height: 0, width: 0 }} animate={{ height: notificationBar ? 100 : 550, width: '100%' }} transition={{ duration: 0.5 }} className={`flex justify-center items-center rounded-3xl ${bgColor} px-2`}>
            {/* KEEPSALIGNED */}
            <div className={`h-full w-full py-3 rounded-3xl ${notificationBar ? 'flex justify-center items-center' : ''} `}>
                {/* SOMETEAMBAR */}
                <div className={` ${notificationBar ? 'h-[90%] ' : 'h-[12%]'} flex justify-center items-center `}>
                    <motion.div initial={{ opacity: 0, width: 0, }} animate={{ opacity: 1, width: 200, }} transition={{ duration: 0.5 }} className={` flex h-full bg-[#ecf3ff] justify-center items-center rounded-lg cursor-pointer `} data-tooltip-id='teamBarToolTip' >
                        <motion.div initial={{ opacity: 0, scale: 0, }} animate={{ opacity: 1, scale: 1, }} transition={{ duration: 1 }} className='flex flex-col w-[70%] px-2'>
                            <span className='w-full font-sans text-sm'> SELECTED </span>
                            <span className='text-black text-lg'> Personal </span>
                        </motion.div>
                        <div className='w-[30%] flex justify-end items-center'>
                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className='bg-[#ef7d11] rounded-full flex justify-center items-center mr-5'>
                                <IconContext.Provider value={{ color: 'white', size: '25' }}>
                                    {/* <img src={usersIcon} alt="" className='w-6 ' /> */}
                                    <HiOutlineUser className='m-2' />
                                </IconContext.Provider>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* PROGRESSBAR */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: notificationBar ? 0 : 1, }} transition={{ duration: 0.5 }} className={` h-[48%] ${notificationBar ? 'hidden' : ''} flex justify-center items-center xxl:px-0 sm:px-3 `}>
                    <DashboardCircularProgressBar progress={projectsDataLength > 0 ? parseInt((ongoingProjects.length / projectsDataLength * 100).toString()) : 0} backgroundColor='#734ae333' inprogressColor='#7249e1' trailColor='#f6f5f8' borderRadius={200} />
                </motion.div>
                {/* PROGRESSTASKS */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: notificationBar ? 0 : 1, }} transition={{ duration: 0.5 }} className={`h-[40%] w-full ${notificationBar ? 'hidden' : ''} `}>
                    <div className='text-lg w-full h-[15%] px-2'>
                        <span>Projects</span>
                    </div>

                    <div className='flex flex-wrap w-full h-[85%]'>
                        {
                            projectsInfo.map((project: any) => (
                                <motion.div key={project.id} initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: isHovered === project.id ? 1.1 : 1 }} className={`w-[45%] h-[45%] ml-2 mt-1 flex flex-col justify-around px-2 rounded-lg`} style={{ background: project.backgroundColor, boxShadow: isHovered === project.id ? project.shadowColor : '', cursor: 'pointer' }} onClick={handleStatsBarClick(project.id)} >
                                    <span className='text-gray-500'> {project.id} </span>
                                    <div className='flex justify-between items-center'>
                                        <div className={`h-[25px] w-[6px] rounded-3xl shadow-inner`} style={{ background: project.whatColor }} ></div>
                                        <span className='text-2xl'> {project.tasksCount} </span>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default StatsBar