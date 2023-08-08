/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import '../index.css'
//Icons
import { CiMail } from 'react-icons/ci'
import { RxClock } from 'react-icons/rx'
import { SlPencil } from 'react-icons/sl'
import { FiChevronDown } from 'react-icons/fi'
//AppComponents
import { ProjectsWindow, StatsBar, NotificationBar, TopBar } from '../components/Home'
import { UserProfileCompletion } from '../components/Popups'
import { themeColors } from '../components/functions'
import { Project } from '../components/interfaces'
//OtherComponents
import { motion } from 'framer-motion'
import 'react-tooltip/dist/react-tooltip.css'
import { useProjectsData } from '../components/Contexts/Project/useProjectsData'
import { useThemeContext } from '../components/Contexts/Theme/useThemeContext'
import { useUserData } from '../components/Contexts/User/useUserContext'
import { useGuestContext } from '../components/Contexts/User/GuestContext'

const Home = () => {

    const [searchContent, setsearchContent] = useState('')
    const [searchedProjectsData, setSearchedProjectsData] = useState<Project[]>([])
    const [noSearchedProjects, setNoSearchedProjects] = useState(false)
    const [notificationBar, setnotificationBar] = useState(false)
    const [completeProfileDialogisOpen, setCompleteProfileDialogisOpen] = useState(false)
    const [isHovered, setIsHovered] = useState('')

    const { theme } = useThemeContext()
    const { userData } = useUserData()
    const { isGuest } = useGuestContext()
    const { projectsData } = useProjectsData()
    const color = themeColors(theme, 'main')
    const bgColor = themeColors(theme, 'background')

    const width = window.innerWidth

    useEffect(() => {
        if (!searchContent) {
            setSearchedProjectsData([])
        }
    }, [searchContent])

    const startedProjects = projectsData && projectsData.filter(project => project.progress < 10)
    const ongoingProjects = projectsData && projectsData.filter(project => project.progress >= 10 && project.progress < 100)
    const completedProjects = projectsData && projectsData.filter(project => project.progress === 100)

    const projectsInfo = [
        {
            id: 'Total',
            tasksCount: projectsData.length,
            backgroundColor: 'rgba(0, 191, 255, 0.3)',
            whatColor: 'rgba(0, 191, 255, 1)',
            shadowColor: '5px 5px 5px 5px rgba(58, 128, 244, 0.2)'
        },
        {
            id: 'Completed',
            tasksCount: completedProjects.length,
            backgroundColor: 'rgba(231, 176, 7, 0.3)',
            whatColor: 'rgba(231, 176, 7, 1)',
            shadowColor: '0 5px 5px 5px rgba(231, 176, 7, 0.2)'
        },
        {
            id: 'In Progress',
            tasksCount: ongoingProjects.length,
            backgroundColor: 'rgba(255, 105, 180, 0.3)',
            whatColor: 'rgba(255, 105, 180, 1)',
            shadowColor: '5px 0 5px 5px rgba(241, 112, 179, 0.2)'
        },
        {
            id: 'Waiting',
            tasksCount: startedProjects.length,
            backgroundColor: 'rgba(115, 74, 227, 0.3)',
            whatColor: 'rgba(115, 74, 227, 1)',
            shadowColor: '0 0 5px 5px rgba(113, 73, 224, 0.2)'
        },
    ]

    const notificationData = [
        {
            icon: <RxClock />,
            iconBackgroundColor: '#734ae3',
            title: 'Sunday, 20 December',
            description: '08:00-11:00 AM',
            actionIcon: <SlPencil />,
        },
        {
            icon: <CiMail />,
            iconBackgroundColor: '#3a80f4',
            title: 'Declaration Centre',
            description: 'Internal Messages',
            actionIcon: <FiChevronDown />,
        }
    ]

    useEffect(() => {
        if (!isGuest && !userData.fullName) {
            setTimeout(() => {
                setCompleteProfileDialogisOpen(true)
            }, 2000);
        }
    }, [])

    return (
        <div className={`w-full h-full`}>
            {/* TOPBAR */}
            <TopBar searchContent={searchContent} setsearchContent={setsearchContent} setNoSearchedProjects={setNoSearchedProjects} setSearchedProjectsData={setSearchedProjectsData} notificationBar={notificationBar} setnotificationBar={setnotificationBar} notificationData={notificationData} />
            {/* MAINAPP */}
            <div className='w-full h-[90%] pt-20 font-oswald'>
                {/* JUSTADIVTOKEEPCHILDRENALIGNED */}
                <div className='w-full flex' style={{ height: 750 }} >
                    {/* PROJECTSSSECTION */}

                    <ProjectsWindow searchContent={searchContent} isHovered={isHovered} noSearchedProjects={noSearchedProjects} setNoSearchedProjects={setNoSearchedProjects} searchedProjectsData={searchedProjectsData} setSearchedProjectsData={setSearchedProjectsData} />

                    {/* RIGHTBARS */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: width >= 1060 ? 1 : 0, height: 750 }} transition={{ duration: 1 }} className={`hidden md:flex flex-col xxl:w-[15%] xxml:w-[20%] damnit:w-[20%] md:w-[25%] w-[20%] mr-[25px] rounded-3xl select-none`}>
                        {/* STATSIG */}
                        <StatsBar notificationBar={notificationBar} bgColor={bgColor} projectsDataLength={projectsData.length} ongoingProjects={ongoingProjects} projectsInfo={projectsInfo} isHovered={isHovered} setIsHovered={setIsHovered} />
                        {/* NOTIFICATIONBAR */}
                        <NotificationBar notificationBar={notificationBar} setnotificationBar={setnotificationBar} notificationData={notificationData} color={color} bgColor={bgColor} />
                    </motion.div>
                </div>
            </div >

            <UserProfileCompletion completeProfileDialogisOpen={completeProfileDialogisOpen} setCompleteProfileDialogisOpen={setCompleteProfileDialogisOpen} />

        </div >
    )
}

export default Home