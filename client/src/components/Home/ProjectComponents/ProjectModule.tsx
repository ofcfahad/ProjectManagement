/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Fragment, useEffect } from 'react'

//AppComponents
import OptionsModal from './OptionsModal'
import Contributors, { Contributor } from './Contributors'
import TaskModule from './TaskModule'
//OtherComponents
import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, Transition } from '@headlessui/react'
import { Divider } from 'antd'
//Icons
import { IconContext } from 'react-icons'
import { GiPaperClip } from 'react-icons/gi'
import { ChatBubbleOvalLeftEllipsisIcon, } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import axios from 'axios'
import { RxCross1 } from 'react-icons/rx'
import { CiEdit } from 'react-icons/ci'
import { addOwnerToPeople, convertHexToRGBA, themeColors } from '../../functions'
import UseAnimations from 'react-useanimations'
import checkBox from 'react-useanimations/lib/checkBox'
import { People } from '../../interfaces'
import { profilePicture } from '../../../assets'
import { useUserData } from '../../Contexts/User/useUserContext'
import { useThemeContext } from '../../Contexts/Theme/useThemeContext'
import { useGuestContext } from '../../Contexts/User/GuestContext'
import { useProjectsData } from '../../Contexts/Project/useProjectsData'


const ProjectModule = ({ height, width, project, isHovered, selectionMode, projectsSelected, setProjectsSelected, loadNewData }: { height: number, width: number, project: any, isHovered: any, selectionMode: boolean, projectsSelected: Array<string>, setProjectsSelected: any, loadNewData: any }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [peopleData, setPeopleData] = useState<Array<People>>([])
    const [editMode, setEditMode] = useState(false)

    const session = Cookies.get('session')
    const { _id, title, description, accentColor, tasks, completedtasks, progress, owner, Dates, people, attachments, comments } = project
    const [colorPickerValue, setColorPickerValue] = useState(accentColor)
    const [titleInputController, setTitleInputController] = useState(title)
    const [descriptionInputController, setDescriptionInputController] = useState(description)

    const { userData } = useUserData()
    const { isGuest } = useGuestContext()
    const { removeProject } = useProjectsData()
    const { theme } = useThemeContext()
    const bgColor = themeColors(theme, 'background')
    const color = themeColors(theme, 'main')

    const InputStyle = `border-2 rounded-xl p-1 w-auto outline-red-500 border-red-500/50`
    const ButtonStyle = `focus:outline-none`

    const getPeopleInfo = async () => {
        if (isGuest) {
            const people = [userData]
            setPeopleData(people)
            return;
        }
        try {
            addOwnerToPeople(people, owner)

            const response = await axios.post(`/server/api/getPeopleInfo`, { userIds: people }, { headers: { Authorization: session } })
            const users = response.data.users
            setPeopleData(users)
        } catch (error) {
            console.log(`from getPeopleInfo: ${error}`);
        }
    }

    const authorData = peopleData[0] && {
        _id: peopleData[0]._id,
        userName: peopleData[0].userName,
        fullName: peopleData[0].fullName,
        userProfilePicture: peopleData[0].userProfilePicture || profilePicture,
        userGithubLink: peopleData[0].userProfilePicture
    }

    const handleProjectDeletion = async (projectId: string) => {
        try {
            const response = await axios.post(`/server/api/deleteProject`, { projectId, userId: userData._id, owner }, {
                headers: {
                    Authorization: session
                }
            });
            if (!response) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const deleteProject = () => {
        if (isGuest) {
            removeProject(_id)
        } else {
            handleProjectDeletion(_id)
        }
    }

    function closeModal() {
        setEditMode(false)
        setTitleInputController(title)
        setDescriptionInputController(description)
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const handleColorChange = (value: any) => {
        setColorPickerValue(value)
    }

    const handleProjectSelection = () => {
        if (projectsSelected.includes(_id)) {
            const filteredList = projectsSelected.filter((project) => project != _id)
            setProjectsSelected(filteredList)
        } else {
            setProjectsSelected([...projectsSelected, _id])
        }
    }

    useEffect(() => {
        if (people) {
            getPeopleInfo()
        }
    }, [people])

    return (
        <>
            <div className="flex items-center justify-center" >
                <Project deleteProject={deleteProject} openModal={openModal} id={_id} title={title} description={description} accentColor={accentColor} progress={progress} people={peopleData} comments={comments} attachments={attachments} owner={owner} height={height} width={width} isHovered={isHovered} selectionMode={selectionMode} projectsSelected={projectsSelected} handleProjectSelection={handleProjectSelection} setEditMode={setEditMode} color={color} bgColor={bgColor} loadNewData={loadNewData} />
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95 translate-y-full"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-95 translate-y-full"
                            >
                                <Dialog.Panel className={`w-full max-w-[40vw] min-h-[80vh] transform overflow-hidden rounded-2xl ${bgColor} p-6 text-left align-middle shadow-xl transition-all`}>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 flex flex-row justify-between items-center w-full"
                                        style={{ color: colorPickerValue }}
                                    >
                                        {editMode ?
                                            <span>
                                                <input className={InputStyle} type="text" value={titleInputController} onChange={(event) => setTitleInputController(event.target.value)} />
                                            </span>
                                            :
                                            <div className='flex m-2'>
                                                {title}
                                                {/* <ColorPicker className='w-' value={colorPickerValue} onChange={handleColorChange} allowClear /> */}
                                            </div>
                                        }

                                        <div className='w-[30%] flex justify-end items-center '>
                                            <AnimatePresence>
                                                {
                                                    editMode &&
                                                    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className='text-xs text-red-500 mr-2' >Currently Editing</motion.div>
                                                }
                                            </AnimatePresence>
                                            {
                                                owner === userData._id &&
                                                <button className={`${ButtonStyle} mr-4 `} onClick={() => setEditMode(!editMode)}>
                                                    <IconContext.Provider value={{ size: '20', color: editMode ? 'red' : '' }}>
                                                        <CiEdit />
                                                    </IconContext.Provider>
                                                </button>
                                            }
                                            <button className={ButtonStyle} onClick={closeModal}>
                                                <RxCross1 />
                                            </button>
                                        </div>
                                    </Dialog.Title>

                                    <Dialog.Panel className={`text-gray-500 text-xs flex items-center`} >
                                        {
                                            Dates.updated ?
                                                <span>
                                                    Last Updated {Dates.updated}
                                                </span>
                                                :
                                                <span>
                                                    Created {Dates.created}
                                                </span>
                                        }
                                        <div className={`${owner === userData._id ? 'bg-green-500' : 'bg-gray-600'} h-2 w-2 rounded-full mx-2`} ></div>
                                        {
                                            peopleData[0] &&
                                            <div className='flex items-center'>
                                                <Contributor profilelink={authorData.userGithubLink} name={authorData.fullName} avatar={authorData.userProfilePicture} linkDisabled={true} isHovering={false} row={true} alignover={false} toLeft={0} toTop={0} onHoverMargin={0} avatarSize={30} avatarShape={'circle'} bordered={false} borderColor={''} borderSize={0} />
                                                <div className='ml-1'>
                                                    {
                                                        owner === userData._id ?
                                                            'You'
                                                            :
                                                            authorData.fullName || authorData.userName
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </Dialog.Panel>

                                    <Divider className={` ${theme === 'dark' ? 'bg-white/20' : ''} `} />

                                    <Dialog.Description className={`text-${color}`}>
                                        {editMode ?
                                            <span>
                                                <input className={InputStyle} type='text' value={descriptionInputController} onChange={(event) => setDescriptionInputController(event.target.value)} />
                                            </span>
                                            :
                                            <span>
                                                {description}
                                            </span>
                                        }
                                    </Dialog.Description>

                                    <Divider className={` ${theme === 'dark' ? 'bg-white/20' : ''} `} />

                                    <h6>Tasks</h6>
                                    <TaskModule tasks={tasks} completedTasks={completedtasks} accentColor={accentColor} />

                                    <Dialog.Panel>
                                        <Contributors contributorsData={peopleData} linkDisabled={false} avatarSize={40} avatarShape={'circle'} bordered={false} borderColor={''} borderSize={0} alignover={true} toLeft={0} toTop={0} onHoverMargin={4} row={true} />
                                    </Dialog.Panel>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}


const Project = ({ id, height, width, title, description, accentColor, progress, people, comments, attachments, owner, deleteProject, openModal, isHovered, color, bgColor, selectionMode, projectsSelected, handleProjectSelection, setEditMode, loadNewData }: { id: string, height: number, width: number, title: string, description: string, accentColor: string, progress: number, people: any, comments: any, attachments: any, owner: string, deleteProject: any, openModal: any, isHovered: string, color: string, bgColor: string, selectionMode: boolean, projectsSelected: Array<string>, handleProjectSelection: any, setEditMode: any, loadNewData: any }) => {

    return (
        <motion.div className={`${bgColor} rounded-3xl p-3 shadow-md hover:shadow-lg hover:shadow-[${accentColor}]`} animate={{ scale: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? 1.02 : isHovered ? 0.8 : 1, opacity: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? 1.06 : isHovered ? 0.8 : 1 }} style={{ height: height || 250, width: width || 250, backdropFilter: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? '' : isHovered ? 'blur(100px)' : '', }}>
            <div className='flex justify-between items-center w-full h-[20%]'>
                <div className={`rounded-full w-auto px-3 py-2 flex justify-center items-center cursor-pointer text-sm`} style={{ color: accentColor, backgroundColor: accentColor && convertHexToRGBA(accentColor, 0.2) || 'whitesmoke', }} onClick={openModal} > {title} </div>
                {selectionMode ?
                    <div>
                        <UseAnimations animation={checkBox} strokeColor={color} reverse={projectsSelected.includes(id)} onClick={handleProjectSelection} />
                    </div>
                    :
                    <OptionsModal deleteProject={deleteProject} projectTitle={title} owner={owner} openModal={openModal} setEditMode={setEditMode} loadNewData={loadNewData} />
                }
            </div>
            <div className=' h-[30%] flex flex-col'>
                <span className='text-left h-full w-full flex items-center '> {description} </span>
            </div>
            <div className='h-[20%]'>
                <span className='w-full flex justify-end' > {progress}% </span>

                <div style={{ width: '100%', height: '8px', backgroundColor: '#f6f5f8', borderRadius: '999px' }}>
                    <motion.div
                        style={{ backgroundColor: '#734ae3', height: '100%', width: 0, borderRadius: '100px' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </div>
            <div className=' h-[30%] mt-2 rounded-b-3xl flex justify-between items-start'>
                <div className='inline-flex items-start w-[70%] h-full'>
                    {
                        people &&
                        <Contributors contributorsData={people} avatarSize={35} avatarShape={'circle'} alignover={true} onHoverMargin={10} row linkDisabled bordered={false} borderColor={''} borderSize={0} toLeft={0} toTop={0} />
                    }
                </div>
                <div className=' inline-flex justify-between items-start py-2 w-[30%] h-full text-xs'>
                    <IconContext.Provider value={{ color: color, size: '15' }}>
                        <button className='inline-flex justify-center items-center '>
                            <GiPaperClip />
                            <span> {attachments} </span>
                        </button>
                        <button className='inline-flex justify-center items-center'>
                            <ChatBubbleOvalLeftEllipsisIcon className={`w-4 `} style={{ color: color }} />
                            <span> {comments} </span>
                        </button>
                    </IconContext.Provider>
                </div>
            </div>

        </motion.div>
    )
}


export default ProjectModule