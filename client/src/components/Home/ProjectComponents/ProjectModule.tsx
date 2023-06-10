/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Fragment, useEffect, useContext } from 'react'

//AppComponents
import OptionsModal from './OptionsModal'
import Contributors from './Contributors'
import TaskModule from './TaskModule'
//OtherComponents
import { motion } from 'framer-motion'
import { Dialog, Transition } from '@headlessui/react'
//Icons
import { IconContext } from 'react-icons'
import { GiPaperClip } from 'react-icons/gi'
import { ChatBubbleOvalLeftEllipsisIcon, } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import axios from 'axios'
import { RxCross1 } from 'react-icons/rx'
import { CiEdit } from 'react-icons/ci'
import { convertHexToRGBA, themeColors } from '../../functions'
import UseAnimations from 'react-useanimations'
import radioButton from 'react-useanimations/lib/radioButton'
import { ThemeContext } from '../../Contexts/ThemeContext'


const ProjectModule = ({ height, width, project, setLoadNewData, isHovered, selectionMode }: { height: number, width: number, project: any, setLoadNewData: any, isHovered: any, selectionMode: boolean }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [peopleData, setPeopleData] = useState<Array<object>>()
    const [editMode, setEditMode] = useState(false)

    const session = Cookies.get('session')
    const { _id, title, description, accentColor, tasks, completedtasks, progress, Owner, people, attachments, comments } = project
    const [titleInputController, setTitleInputController] = useState(title)
    const [descriptionInputController, setDescriptionInputController] = useState(description)

    const { theme } = useContext(ThemeContext)
    const bgColor = themeColors(theme, 'background')
    const color = themeColors(theme, 'main')

    const InputStyle = `border-2 rounded-lg p-1 w-auto`

    const getPeopleInfo = async () => {
        try {
            const response = await axios.post(`/server/api/getPeopleInfo`, { userIds: people }, {
                headers: {
                    Authorization: session
                }
            });
            const users = response.data.users
            setPeopleData(users)
        } catch (error) {
            console.log(`from getPeopleInfo: ${error}`);
        }
    }

    const handleProjectDeletion = async (projectId: string) => {
        try {
            const response = await axios.post(`/server/api/deleteProject`, { projectId }, {
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
        handleProjectDeletion(_id)
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

    useEffect(() => {
        getPeopleInfo()
    }, [people])

    return (
        <>
            <div className="flex items-center justify-center" >
                <Project setLoadNewData={setLoadNewData} deleteProject={deleteProject} openModal={openModal} title={title} description={description} accentColor={accentColor} progress={progress} people={peopleData} comments={comments} attachments={attachments} height={height} width={width} isHovered={isHovered} selectionMode={selectionMode} color={color} bgColor={bgColor} />
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
                                        style={{ color: accentColor }}
                                    >
                                        {editMode ?
                                            <span>
                                                <input className={InputStyle} type="text" value={titleInputController} onChange={(event) => setTitleInputController(event.target.value)} />
                                            </span>
                                            :
                                            <span>
                                                {title}
                                            </span>
                                        }

                                        <div className='w-[10%] flex justify-between items-center'>
                                            <button onClick={() => setEditMode(!editMode)}>
                                                <IconContext.Provider value={{ size: '20' }}>
                                                    <CiEdit />
                                                </IconContext.Provider>
                                            </button>
                                            <button onClick={closeModal}>
                                                <RxCross1 />
                                            </button>
                                        </div>
                                    </Dialog.Title>

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

                                    <h6>Tasks</h6>
                                    <TaskModule tasks={tasks} completedTasks={completedtasks} accentColor={accentColor} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}


const Project = ({ height, width, title, description, accentColor, progress, people, comments, attachments, setLoadNewData, deleteProject, openModal, isHovered, color, bgColor, selectionMode }: { height: number, width: number, title: string, description: string, accentColor: string, progress: number, people: any, comments: any, attachments: any, setLoadNewData: any, deleteProject: any, openModal: any, isHovered: string, color: string, bgColor: string, selectionMode: boolean }) => {

    return (
        <motion.div className={`${bgColor} rounded-3xl p-3 shadow-md hover:shadow-lg`} animate={{ scale: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? 1.06 : isHovered ? 0.8 : 1, opacity: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? 1.06 : isHovered ? 0.8 : 1 }} style={{ height: height || 250, width: width || 250, backdropFilter: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? '' : isHovered ? 'blur(100px)' : '', }}>
            <div className='flex justify-between items-center w-full h-[20%]'>
                <div className={`rounded-full w-auto px-3 py-2 flex justify-center items-center cursor-pointer text-sm`} style={{ color: accentColor, backgroundColor: accentColor && convertHexToRGBA(accentColor, 0.2) || 'whitesmoke', }} onClick={openModal} > {title} </div>
                {selectionMode ?
                    <UseAnimations animation={radioButton} strokeColor={color} />
                    :
                    <OptionsModal deleteProject={deleteProject} setLoadNewData={setLoadNewData} projectTitle={title} />
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
                        <Contributors contributorsData={people} avatarSize={35} avatarShape={'rounded-circle'} alignover={true} onHoverMargin={10} row linkDisabled bordered={false} borderColor={''} borderSize={0} toLeft={0} toTop={0} />
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