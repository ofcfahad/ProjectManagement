/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import ProjectModule from './ProjectModule';
import { motion } from 'framer-motion';
import UseAnimations from 'react-useanimations';
import { IconContext } from 'react-icons';
import { SlRefresh } from 'react-icons/sl';
import settings2 from 'react-useanimations/lib/settings2';
import CreateProject from './CreateProject';
import { debounce } from 'lodash';
import { themeColors } from '../../utils';
import Loading from '../../Loading';
import { useApi, useProjectsData, useTheme } from '../../Contexts';
import Cookies from 'js-cookie';

export default function ProjectsWindow(props: any) {

    const [dialogisOpen, setDialogisOpen] = useState(false)
    const [fetchingData, setFetchingData] = useState(false)

    const { searchContent, isHovered, noSearchedProjects, setNoSearchedProjects, searchedProjectsData, setSearchedProjectsData } = props
    const { theme } = useTheme()

    const { getProjectsData, getProjectsDatafromDatabase } = useProjectsData()
    const projectsData = getProjectsData()

    const { searchProjects } = useApi()

    const color = themeColors(theme, 'main')
    const bgColor = themeColors(theme, 'background')
    const projectsDatax = searchedProjectsData.length > 0 ? searchedProjectsData : projectsData

    const handleDialogClose = () => {
        setDialogisOpen(false)
        loadNewData()
    }

    const fetchSearchedProjectsData = async () => {
        const projects = await searchProjects(searchContent)
        if (projects.length === 0) {
            setNoSearchedProjects(true)
        } else {
            setNoSearchedProjects(false)
            setSearchedProjectsData(projects)
        }
    }

    const debouncedFetchFunction = debounce(fetchSearchedProjectsData, 1000)

    useEffect(() => {
        if (searchContent) {
            debouncedFetchFunction()
        } else {
            setNoSearchedProjects(false)
            setSearchedProjectsData([])
        }

        return () => {
            debouncedFetchFunction.cancel()
        };
    }, [searchContent])

    const loadNewData = async () => {
        setFetchingData(true)
        if (Cookies.get('session') === 'loggedinasguestuser') {
            getProjectsDatafromDatabase()
        }
        setTimeout(() => {
            setFetchingData(false)
        }, 1000)
    }

    return (
        <div className={`h-full xxl:w-[85%] md:w-[75%] w-[100%] ${bgColor} text-${color} mx-[25px] rounded-3xl`}>

            {/* TOPBAR */}
            <div className='rounded-t-3xl h-[15%]'>
                {/* UPPERSECTION */}
                <div className='flex h-[50%] w-full justify-between items-center bg-transparent px-4 py-1 '>
                    <h1 className='text-center mt-2 pointer-events-none select-none'> Projects </h1>
                    <div className='flex justify-between items-center'>

                        <motion.button initial={{ rotate: -100 }} animate={{ rotate: fetchingData ? 100 : 0, x: 0 }} transition={{ duration: 1, x: { duration: 0.5 } }} className='mr-4' style={{ cursor: 'pointer' }} onClick={loadNewData} >
                            <IconContext.Provider value={{ color: color, size: '18' }} >
                                <SlRefresh />
                            </IconContext.Provider>
                        </motion.button>

                        <UseAnimations animation={settings2} className='rotate-90 cursor-pointer' strokeColor={color} onClick={() => { }} />

                        <CreateProject loadNewData={loadNewData} />
                    </div>
                </div>

            </div>

            {/* PROJECTS */}
            <div className={`w-[96%] flex justify-center items-center ml-[2%] max-h-[1000%] h-[83%] ${theme === 'dark' && 'bg-opacity-10'} bg-[#f6f5f8] rounded-3xl`}>
                {
                    !fetchingData ?
                        noSearchedProjects && searchContent ?
                            `No Projects with title ${searchContent} found`
                            :
                            <div className='w-full h-full max-h-[10000px] overflow-y-scroll relative'>
                                <div className='w-full flex flex-wrap'>
                                    {
                                        projectsDatax && projectsDatax.map((project: any) => (
                                            <motion.div
                                                key={project._id || project.title}
                                                className={`ml-2 mt-2 rounded-3xl`}
                                                style={{ height: 200, width: 270 }}
                                            >
                                                <div>
                                                    <ProjectModule
                                                        height={200}
                                                        width={270}
                                                        project={project}
                                                        isHovered={isHovered}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))
                                    }
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
