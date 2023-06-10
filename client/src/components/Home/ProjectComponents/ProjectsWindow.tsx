/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import ProjectModule from './ProjectModule';
import { motion } from 'framer-motion';
import UseAnimations from 'react-useanimations';
import toggle from 'react-useanimations/lib/toggle';
import { Tooltip } from 'react-tooltip';
import { IconContext } from 'react-icons';
import { SlRefresh } from 'react-icons/sl';
import settings2 from 'react-useanimations/lib/settings2';
import CreateProject from './CreateProject';
import { debounce } from 'lodash';
import Cookies from 'js-cookie';
import { ThemeContext } from '../../Contexts/ThemeContext';
import { themeColors } from '../../functions';
import Loading from '../../Loading';
import { fetchProjectsData, fetchSearchedProjectsData } from '../functions'
import { UserDataContext, UserSettingsContext } from '../../Contexts';

export default function ProjectsWindow(props: any) {

    const [editMode, setEditMode] = useState(false)

    const { searchContent, fetchingData, setFetchingData, loadNewData, setLoadNewData, isHovered, setCompleteProfileDialogisOpen, projectsData, setProjectsData, noSearchedProjects, setNoSearchedProjects, searchedProjectsData, setSearchedProjectsData } = props
    const { theme } = useContext(ThemeContext)
    const userData = useContext(UserDataContext)
    const { toolTipisVisible } = useContext(UserSettingsContext)
    const color = themeColors(theme, 'main')
    const bgColor = themeColors(theme, 'background')
    const userId = userData._id
    const session = Cookies.get('session')!
    const projectsDatax = searchedProjectsData.length > 0 ? searchedProjectsData : projectsData

    const debouncedFetchFunction = debounce(fetchSearchedProjectsData, 1000)

    useEffect(() => {
        if (searchContent) {
            debouncedFetchFunction(setFetchingData, setLoadNewData, setNoSearchedProjects,  setSearchedProjectsData, userId, session, searchContent)
        }

        return () => {
            debouncedFetchFunction.cancel()
        };
    }, [searchContent])

    useEffect(() => {
        if (!userData.fullName) {
            setTimeout(() => {
                setCompleteProfileDialogisOpen(true)
            }, 2000);
        }

        if (userId) {
            fetchProjectsData(setFetchingData, setProjectsData, setLoadNewData, userId, session)
        }
    }, [])

    useEffect(() => {
        if (loadNewData && userId) {
            fetchProjectsData(setFetchingData, setProjectsData, setLoadNewData, userId, session);
        }
    }, [loadNewData]);

    return (
        <div className={`h-full xxl:w-[85%] md:w-[75%] w-[100%] ${bgColor} text-${color} mx-[25px] rounded-3xl`} >
            {/* TOPBAR */}
            <div className='rounded-t-3xl h-[15%]'>
                {/* UPPERSECTION */}
                <div className='flex h-[50%] w-full justify-between items-center bg-transparent px-4 py-1 '>
                    <h1 className='font-josefin text-center mt-2 pointer-events-none select-none'> Projects </h1>
                    <div className='flex justify-between items-center'>

                        <UseAnimations animation={toggle} reverse={editMode} data-tooltip-id='projectsSelectToolTip' size={25} strokeColor={color} className={` cursor-pointer mr-4`} onClick={() => setEditMode(!editMode)} />
                        {
                            toolTipisVisible &&
                            <Tooltip id='projectsSelectToolTip' delayShow={100} delayHide={0} place='left'>
                                Select Projects
                            </Tooltip>
                        }

                        <motion.button initial={{ rotate: -100 }} animate={{ rotate: loadNewData ? 100 : 0 }} transition={{ duration: 1 }} className='mr-4' data-tooltip-id='projectsRefreshToolTip' onClick={() => setLoadNewData(true)} >
                            <IconContext.Provider value={{ color: color, size: '18' }} >
                                <SlRefresh />
                            </IconContext.Provider>
                        </motion.button>
                        {
                            toolTipisVisible &&
                            <Tooltip id='projectsRefreshToolTip' delayShow={100} delayHide={0} place='left'>
                                Sync Projects
                            </Tooltip>
                        }

                        <UseAnimations animation={settings2} data-tooltip-id='projectSettingsToolTip' className='rotate-90' strokeColor={color} />
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

            {/* PROJECTS */}
            <div className={`w-[96%] flex justify-center items-center ml-[2%] max-h-[1000%] h-[83%] ${theme === 'dark' ? 'bg-[#4c5e81]' : 'bg-[#f6f5f8]'} rounded-3xl`}>
                {
                    !fetchingData ?
                        noSearchedProjects && searchContent ?
                            `No Projects with title ${searchContent} found`
                            :
                            <div className='w-full h-full max-h-[10000px] overflow-y-scroll relative'>
                                <div className='w-full flex flex-wrap'>
                                    {projectsDatax.map((project: any) => (
                                        <motion.div
                                            key={project._id}
                                            className={`ml-2 mt-2 rounded-3xl`}
                                            style={{ height: 200, width: 270 }}
                                        >
                                            <div>
                                                <ProjectModule
                                                    height={200}
                                                    width={270}
                                                    project={project}
                                                    setLoadNewData={setLoadNewData}
                                                    isHovered={isHovered}
                                                    selectionMode={editMode}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        :
                        <div className='w-full h-full flex justify-center items-center'>
                            <Loading haveBackgroundColor={false} backgroundColor={''} />
                        </div>
                }
            </div>

        </div>
    );
}
