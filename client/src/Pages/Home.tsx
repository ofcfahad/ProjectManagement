/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import '../index.css'
//Icons
import { IconContext } from 'react-icons'
import { CiCalendar, CiMail, CiSearch } from 'react-icons/ci'
import { HiOutlineUser } from 'react-icons/hi2'
import { RxClock, RxCross1, RxDividerVertical } from 'react-icons/rx'
import { SlPencil, SlRefresh } from 'react-icons/sl'
import { FiChevronDown } from 'react-icons/fi'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { BellAlertIcon, BellIcon, BellSlashIcon } from '@heroicons/react/24/outline'
import settings2 from 'react-useanimations/lib/settings2'
import menu4 from 'react-useanimations/lib/menu4'
//AppComponents
import { ProgressBar, NotificationModule, CreateProject, Loading } from '../components'
import ProjectsWindow from '../components/ProjectComponents/ProjectsWindow'
import { UserProfileCompletion } from '../components/Popups'
//OtherComponents
import { motion } from 'framer-motion'
import { Listbox } from '@headlessui/react'
import { DatePicker } from 'antd'
import Cookies from 'js-cookie'
import { easeBackInOut } from 'd3-ease'
import UseAnimations from 'react-useanimations'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import axios from 'axios'


const Home = ({ expand, setExpand, toolTipisVisible, userData }: { expand: boolean, setExpand: any, toolTipisVisible: boolean, userData: any }) => {

    interface Project {
        _id: number,
        title: string,
        desription: string,
        tasks: Array<string>,
        completedtasks: Array<string>,
        progress: number,
        people: Array<object>,
        Owner: object,
        attachments: number,
        comments: number
    }


    const [projectsData, setProjectsData] = useState<Project[]>([])
    const [isExpanded, setisExpanded] = useState(false)
    const [isFocused, setisFocused] = useState(false)
    const [searchContent, setsearchContent] = useState('')
    const [notificationBar, setnotificationBar] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null);
    const [loadNewData, setLoadNewData] = useState(false);
    const [fetchingData, setFetchingData] = useState(false)
    const [completeProfileDialogisOpen, setCompleteProfileDialogisOpen] = useState(false)

    const userId = userData._id
    const session = Cookies.get('session')

    const fetchProjectsData = async () => {
        try {
            setFetchingData(true)
            const response = await axios.post(`/server/api/projectsData`, { userId }, { headers: { Authorization: session } })

            if (!response) {
                throw new Error('Network response was not ok');
            }

            const data = await response.data
            setProjectsData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadNewData(false);
            setFetchingData(false)
        }
    };

    useEffect(() => {
        if (!userData.fullName) {
            setTimeout(() => {
                setCompleteProfileDialogisOpen(true)
            }, 2000);
        }

        if (userId) {
            fetchProjectsData()
        }
    }, [])

    useEffect(() => {
        if (loadNewData && userId) {
            fetchProjectsData();
        }
    }, [loadNewData]);


    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const width = window.innerWidth

    const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setsearchContent(event.target.value);
    };


    const onFocus = () => {
        setisFocused(true);
        setisExpanded(true);
    }
    const onBlur = () => {
        if (!searchContent) {
            setisFocused(false);
            setisExpanded(false);
        }
    };

    const SearchBar = document.getElementById('search_query')

    const handleSearchIconClick = () => { isFocused && searchContent ? console.log(searchContent) : isFocused ? SearchBar?.focus() : null }
    const handleCrossClick = () => { setsearchContent(''), setisExpanded(false) }

    const startedProjects = projectsData.filter(project => project.progress < 10)
    const ongoingProjects = projectsData.filter(project => project.progress >= 10 && project.progress < 100)
    const completedProjects = projectsData.filter(project => project.progress === 100)

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


    return (
        <div className={`w-full h-full`}>
            {/* TOPBAR */}
            <div className='h-[10%] flex flex-col justify-center items-center'>
                <div className='w-full h-[50%] items-center justify-between px-4 flex'>
                    <IconContext.Provider value={{ color: 'black', size: '20' }}>
                        {/* LEFT */}
                        <div className='flex h-full items-center'>
                            {/* MENUBUTTON */}
                            <div className='flex items-center'>
                                <UseAnimations animation={menu4} size={25} reverse={expand} onClick={() => setExpand(!expand)} className='cursor-pointer' data-tooltip-id='menuToolTip' />
                                {
                                    toolTipisVisible &&
                                    <Tooltip id='menuToolTip' delayShow={100} delayHide={0} place='top' float >
                                        Menu
                                    </Tooltip>
                                }
                            </div>
                            {/* SEARCHBAR */}
                            <motion.div initial={{ width: 200 }} animate={{ width: isExpanded ? 500 : 200 }} transition={{ duration: 0.5 }} className='ml-5 h-[70%] flex items-center bg-transparent select-none'>
                                <div className='w-full h-full flex rounded-full bg-white items-center px-1' onFocus={onFocus} onBlur={onBlur} >
                                    {/* ICON */}
                                    <button onClick={handleSearchIconClick} className='h-full rounded-l-full px-1' data-tooltip-id='searchIconToolTip' >
                                        <CiSearch />
                                    </button>
                                    {
                                        toolTipisVisible &&
                                        <Tooltip id='searchIconToolTip' delayShow={100} delayHide={0} place='top'>
                                            Search
                                        </Tooltip>
                                    }
                                    {/* INPUT */}
                                    <input type="span" placeholder='Search' id='search_query' value={searchContent} className={`px-1 py-1 focus:outline-none bg-transparent h-full w-full flex items-center`} onChange={handleChange} />
                                    <div className='rounded-r-full h-full px-2'>
                                        {
                                            searchContent &&
                                            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='h-full w-full' style={{ color: 'white' }} onClick={handleCrossClick}>
                                                <RxCross1 />
                                            </motion.button>
                                        }
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        {/* RIGHT */}
                        <div className={`h-full w-auto flex`}>
                            {/* OTHERS */}
                            <div className='flex justify-center items-center w-[40%]'>
                                <IconContext.Provider value={{ size: '25' }}>
                                    {/* NOTIS */}
                                    <button onClick={() => setnotificationBar(!notificationBar)} disabled={window.innerWidth >= 1060 ? false : true} className=' h-5 ' data-tooltip-id='notificationIconToolTip' >
                                        {
                                            notificationData && !notificationBar ?
                                                <BellAlertIcon className=' w-5 text-black ' />
                                                :
                                                notificationBar ?
                                                    <BellSlashIcon className=' w-5 text-black ' />
                                                    :
                                                    <BellIcon className=' w-5 text-black ' />
                                        }
                                    </button>
                                    {
                                        toolTipisVisible &&
                                        <Tooltip id='notificationIconToolTip' delayShow={100} delayHide={0} place='top'>
                                            Notification Bar
                                        </Tooltip>
                                    }
                                    {/* CALENDER */}
                                    <div data-tooltip-id='calenderIconToolTip' >
                                        <DatePicker
                                            onChange={handleDateChange}
                                            value={selectedDate}
                                            style={{ backgroundColor: 'transparent', width: 40, cursor: 'pointer' }}
                                            allowClear={false}
                                            inputReadOnly={true}
                                            placeholder={''}
                                            bordered={false}
                                            suffixIcon={
                                                <IconContext.Provider value={{ color: 'black', size: '23' }}>
                                                    <CiCalendar />
                                                </IconContext.Provider>
                                            }
                                        />
                                    </div>
                                    {
                                        toolTipisVisible &&
                                        <Tooltip id='calenderIconToolTip' delayShow={100} delayHide={0} place='top'>
                                            Calender
                                        </Tooltip>
                                    }
                                </IconContext.Provider>
                            </div>
                            {/* SEPERATOR */}
                            <div className='py-2'>
                                <IconContext.Provider value={{ color: 'gray', size: '30' }}>
                                    <RxDividerVertical />
                                </IconContext.Provider>
                            </div>
                            {/* PROFILE */}
                            <div className="w-full flex justify-center items-center select-none" data-tooltip-id='profileToolTip' >
                                <Listbox value={userData?.userName}>
                                    <div>
                                        <Listbox.Button className="flex justify-around relative w-full items-center cursor-default rounded-lg bg-transparent hover:shadow-md focus:outline-none">
                                            <div>
                                                <img src={userData?.userProfilePicture || 'src//assets/pfp.png'} className=" h-10 w-10 rounded-full" />
                                            </div>
                                            <div className="text-black ml-2 text-xs flex"> {userData.fullName || userData.userName} </div>
                                            <div className=''>
                                                <ChevronDownIcon
                                                    className="w-5 text-black"
                                                />
                                            </div>
                                        </Listbox.Button>
                                    </div>
                                </Listbox>
                            </div>
                            {
                                toolTipisVisible &&
                                <Tooltip id='profileToolTip' delayShow={100} delayHide={0} place='top'>
                                    Profile
                                </Tooltip>
                            }

                        </div>
                    </IconContext.Provider>
                </div>
            </div>

            {/* MAINAPP */}
            <div className='w-full h-[90%] bg-transparent pt-20 font-oswald'>
                {/* JUSTADIVTOKEEPCHILDRENALIGNED */}
                <div className='w-full flex' style={{ height: 750 }} >
                    {/* PROJECTSSSECTION */}
                    <div className='h-full xxl:w-[85%] md:w-[75%] w-[100%] bg-white mx-[25px] rounded-3xl' >
                        {/* TOPBAR */}
                        <div className='rounded-t-3xl h-[15%]'>
                            {/* UPPERSECTION */}
                            <div className='flex h-[50%] w-full justify-between items-center bg-transparent px-4 py-1 '>
                                <h1 className='font-josefin text-center mt-2 pointer-events-none select-none'> Projects </h1>
                                <div className='flex justify-between items-center'>
                                    <motion.button initial={{ rotate: -100 }} animate={{ rotate: loadNewData ? 100 : 0 }} transition={{ duration: 1 }} className='mr-4' data-tooltip-id='projectsRefreshToolTip' onClick={() => setLoadNewData(true)} >
                                        <IconContext.Provider value={{ color: 'black', size: '18' }} >
                                            <SlRefresh />
                                        </IconContext.Provider>
                                    </motion.button>
                                    {
                                        toolTipisVisible &&
                                        <Tooltip id='projectsRefreshToolTip' delayShow={100} delayHide={0} place='left'>
                                            Sync Projects
                                        </Tooltip>
                                    }


                                    <UseAnimations animation={settings2} data-tooltip-id='projectSettingsToolTip' className='rotate-90' />
                                    {
                                        toolTipisVisible &&
                                        <Tooltip id='projectSettingsToolTip' delayShow={100} delayHide={0} place='top'>
                                            Projects Settings
                                        </Tooltip>
                                    }
                                    <CreateProject setLoadNewData={setLoadNewData} setFetchingData={setFetchingData} reference={'main'} userId={userId} />
                                </div>
                            </div>
                            {/* BOTTOMSECTION */}
                            <div className='h-[50%] w-full flex px-4 select-none'>
                                {/* STARTED */}
                                <div className='w-1/3 flex justify-between items-center ml-1'>
                                    <span className='cursor-default'>Started</span>
                                    <CreateProject setLoadNewData={setLoadNewData} setFetchingData={setFetchingData} reference={'started'} userId={userId} />
                                </div>
                                {/* ONGOING */}
                                <div className='w-1/3 flex justify-between items-center ml-3' >
                                    <span className='cursor-default'>On Going</span>
                                    <CreateProject setLoadNewData={setLoadNewData} setFetchingData={setFetchingData} reference={'ongoing'} userId={userId} />
                                </div>
                                {/* COMPLETED */}
                                <div className='w-1/3 flex justify-between items-center ml-3'>
                                    <span className='cursor-default'>Completed</span>
                                    <CreateProject setLoadNewData={setLoadNewData} setFetchingData={setFetchingData} reference={'completed'} userId={userId} />
                                </div>
                            </div>

                        </div>

                        {/* TASKS */}
                        <div className='w-[96%] flex justify-center items-center ml-[2%] max-h-[1000%] h-[83%] bg-[#f6f5f8] rounded-3xl '>
                            {
                                !fetchingData ?
                                    <ProjectsWindow projectsData={projectsData} setLoadNewData={setLoadNewData} />
                                    :
                                    <div className='w-full h-full flex justify-center items-center'>
                                        <Loading haveBackgroundColor={false} backgroundColor={''} />
                                    </div>
                            }
                        </div>

                    </div>
                    {/* IDONOTKNOWWHATTHATIS */}
                    <motion.div initial={{ opacity: 0, }} animate={{ opacity: width >= 1060 ? 1 : 0, }} transition={{ duration: 1 }} className={`hidden md:flex flex-col xxl:w-[15%] xxml:w-[20%] damnit:w-[20%] md:w-[25%] w-[20%] bg-transparent mr-[25px] rounded-3xl select-none`}>
                        {/* STATSIG */}
                        <motion.div initial={{ height: 0, width: 0 }} animate={{ height: notificationBar ? 150 : 530, width: '100%' }} transition={{ duration: 0.5 }} className='flex justify-center items-center rounded-3xl bg-white px-2'>
                            {/* KEEPSALIGNED */}
                            <div className={`h-full w-full py-3 rounded-3xl ${notificationBar ? 'flex justify-center items-center' : ''} `}>
                                {/* SOMETEAMBAR */}
                                <div className={` ${notificationBar ? 'h-[50%] ' : 'h-[12%]'} flex justify-center items-center `}>

                                    <motion.div initial={{ opacity: 0, width: 0, }} animate={{ opacity: 1, width: 200, }} transition={{ duration: 0.5 }} className={` flex h-full bg-[#ecf3ff] justify-center items-center rounded-lg cursor-pointer `} data-tooltip-id='teamBarToolTip' >
                                        <motion.div initial={{ opacity: 0, scale: 0, }} animate={{ opacity: 1, scale: 1, }} transition={{ duration: 1 }} className='flex flex-col w-[70%] px-2'>
                                            <span className='w-full font-sans text-sm'> SELECTED </span>
                                            <span className='text-black text-lg font-josefin'> Personal </span>
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
                                    {
                                        toolTipisVisible &&
                                        <Tooltip id='teamBarToolTip' delayShow={100} delayHide={0} place='top'>
                                            Team
                                        </Tooltip>
                                    }
                                </div>

                                {/* PROGRESSBAR */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: notificationBar ? 0 : 1, }} transition={{ duration: 0.5 }} className={` h-[48%] ${notificationBar ? 'hidden' : ''} flex justify-center items-center xxl:px-0 sm:px-3 `}>
                                    <ProgressBar progress={projectsData.length > 0 ? parseInt((ongoingProjects.length / projectsData.length * 100).toString()) : 0} backgroundColor='#734ae333' inprogressColor='#7249e1' trailColor='#f6f5f8' borderRadius={200} padding={0} />
                                </motion.div>
                                {/* PROGRESSTASKS */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: notificationBar ? 0 : 1, }} transition={{ duration: 0.5 }} className={`h-[40%] w-full ${notificationBar ? 'hidden' : ''} `}>
                                    <div className='font-josefin text-lg w-full h-[15%] px-2'>
                                        <span>Projects</span>
                                    </div>

                                    <div className='flex flex-wrap w-full h-[85%]'>
                                        {
                                            projectsInfo.map((project) => (
                                                <motion.div key={project.id} initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1, }} whileHover={{ scale: 1.1, boxShadow: project.shadowColor }} transition={{ ease: easeBackInOut }} className={`w-[45%] h-[45%] ml-2 mt-1 flex flex-col justify-around px-2 rounded-lg`} style={{ background: project.backgroundColor }} >
                                                    <span className='text-gray-500'> {project.id} </span>
                                                    <div className='flex justify-between items-center'>
                                                        <div className={`h-[25px] w-[6px] rounded-3xl shadow-inner`} style={{ background: project.whatColor }} ></div>
                                                        <span className='text-2xl font-alkatra'> {project.tasksCount} </span>
                                                    </div>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                        {/* WHATEVERTHATIS */}
                        <motion.div initial={{ height: 0 }} animate={{ height: notificationBar ? 600 : 212 }} transition={{ duration: 0.5 }} id='youknowwhat' className=' w-full bg-white mt-[15px] rounded-3xl '>
                            <button className='bg-[#f2f6fb]/25 backdrop-blur-lg w-full h-6 flex justify-center items-center rounded-t-3xl' onClick={() => setnotificationBar(!notificationBar)}>
                                {
                                    notificationBar ?
                                        <ChevronDownIcon width={30} />
                                        :
                                        <ChevronUpIcon width={30} />
                                }
                            </button>
                            <div className={`w-full ${notificationBar ? `h-[661px]` : 'h-[200px]'} relative rounded-b-3xl bg-transparent flex flex-col select-span`}>
                                <div className={`w-full  ${notificationBar ? 'h-[87%]  ' : 'h-[94%] '} max-h-[1000px] absolute transition-all ease-linear rounded-b-3xl ${notificationBar ? 'overflow-y-scroll' : 'overflow-hidden'} `}>
                                    <NotificationModule notificationData={notificationData} height={0} icon={undefined} actionIcon={undefined} iconBackgroundColor={''} title={''} description={''} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div >

            <UserProfileCompletion completeProfileDialogisOpen={completeProfileDialogisOpen} setCompleteProfileDialogisOpen={setCompleteProfileDialogisOpen} />

        </div >
    )
}

export default Home