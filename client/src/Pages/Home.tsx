/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import '../index.css'
//AppComponents
import { ProjectsWindow, StatsBar, NotificationBar, TopBar } from '../components/Home'
import { themeColors } from '../components/utils'
import { Project } from '../components/Interfaces'
import { useProjectsData, useTheme } from '../components/Contexts'
//OtherComponents
import { motion } from 'framer-motion'
import 'react-tooltip/dist/react-tooltip.css'

const Home = () => {

    const [searchContent, setsearchContent] = useState('')
    const [searchedProjectsData, setSearchedProjectsData] = useState<Project[]>([])
    const [noSearchedProjects, setNoSearchedProjects] = useState(false)
    const [notificationBar, setnotificationBar] = useState(false)
    const [isHovered, setIsHovered] = useState('')

    const { theme } = useTheme()

    const { getProjectsData } = useProjectsData()
    const projectsData = getProjectsData()

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

    return (
        <div className={`w-full h-full`}>

            {/* TOPBAR */}
            <div className='h-[10%] flex flex-col justify-center items-center'>
                <TopBar searchContent={searchContent} setsearchContent={setsearchContent} setNoSearchedProjects={setNoSearchedProjects} setSearchedProjectsData={setSearchedProjectsData} notificationBar={notificationBar} setnotificationBar={setnotificationBar} />
            </div>

            {/* MAINAPP */}
            <div className='w-full h-[90%] pt-20 font-oswald'>

                {/* JUSTADIVTOKEEPCHILDRENALIGNED */}
                <div className='w-full flex' style={{ height: 750 }}>

                    {/* PROJECTSSSECTION */}
                    <ProjectsWindow searchContent={searchContent} isHovered={isHovered} noSearchedProjects={noSearchedProjects} setNoSearchedProjects={setNoSearchedProjects} searchedProjectsData={searchedProjectsData} setSearchedProjectsData={setSearchedProjectsData} />

                    {/* RIGHTBARS */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: width >= 1060 ? 1 : 0, height: 750 }} transition={{ duration: 1 }} className={`hidden md:flex flex-col xxl:w-[15%] xxml:w-[20%] damnit:w-[20%] md:w-[25%] w-[20%] mr-[25px] rounded-3xl select-none`}>
                        {/* STATSIG */}
                        <StatsBar notificationBar={notificationBar} bgColor={bgColor} projectsDataLength={projectsData.length} ongoingProjects={ongoingProjects} projectsInfo={projectsInfo} isHovered={isHovered} setIsHovered={setIsHovered} />
                        {/* NOTIFICATIONBAR */}
                        <NotificationBar notificationBar={notificationBar} setnotificationBar={setnotificationBar} color={color} bgColor={bgColor} />

                    </motion.div>

                </div>

            </div>

        </div >
    )
}

export default Home