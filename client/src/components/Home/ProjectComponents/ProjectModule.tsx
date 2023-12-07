/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Fragment, useEffect } from 'react'
//AppComponents
import Contributors, { Contributor } from './Contributors'
import TaskModule from './TaskModule'
//OtherComponents
import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, Transition } from '@headlessui/react'
import { Avatar, Divider } from 'antd'
//Icons
import { IconContext } from 'react-icons'
import { GiPaperClip } from 'react-icons/gi'
import { ChatBubbleOvalLeftEllipsisIcon, } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import axios from 'axios'
import { RxCross1, RxDotsHorizontal } from 'react-icons/rx'
import { CiEdit } from 'react-icons/ci'
import { addOwnerToPeople, convertHexToRGBA, themeColors } from '../../utils'
import { Project } from '../../Interfaces'
import { useUserData, useTheme } from '../../Contexts'
import ProgressBar from './ProgressBar'


const ProjectModule = ({ height, width, project, isHovered }: { height: number, width: number, project: Project, isHovered: string }) => {
    const { _id, title, description, accentColor, tasks, completedtasks, progress, owner, Dates, people, attachments, comments }: Project = project
    addOwnerToPeople(people, owner)

    const [isOpen, setIsOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [buttonHovering, setButtonHovering] = useState('')

    const [colorPickerValue, setColorPickerValue] = useState(accentColor)
    const [titleInputController, setTitleInputController] = useState(title)
    const [descriptionInputController, setDescriptionInputController] = useState(description)

    const { getUserData } = useUserData()
    const userData = getUserData()

    const { theme } = useTheme()
    const bgColor = themeColors(theme, 'background')
    const color = themeColors(theme, 'main')

    const InputStyle = `w-full m-2 focus:outline-none`
    const ButtonStyle = `focus:outline-none`

    function formatDate(unformattedDate: Date) {
        return unformattedDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
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

    return (
        <>
            <div className="flex items-center justify-center" >
                <DashboardProject openModal={openModal} project={project} height={height} width={width} isHovered={isHovered} color={color} bgColor={bgColor} />
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
                        <div className="fixed inset-0 bg-black/20 backdrop-blur" />
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
                                        <span>
                                            <input className={InputStyle} disabled={!editMode} type="text" value={titleInputController} onChange={(event) => setTitleInputController(event.target.value)} />
                                        </span>

                                        <div className='w-[30%] flex justify-end items-center '>
                                            <AnimatePresence>
                                                {
                                                    editMode &&
                                                    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className='text-xs text-red-500 mr-2' >Currently Editing</motion.div>
                                                }
                                            </AnimatePresence>
                                            {
                                                owner === userData._id &&
                                                <motion.button animate={{ background: buttonHovering == 'edit' ? "whitesmoke" : "transparent" }} onMouseOver={() => setButtonHovering('edit')} onMouseOut={() => setButtonHovering('')} className={`p-1 rounded mr-4 ${ButtonStyle}`} onClick={() => setEditMode(!editMode)}>
                                                    <IconContext.Provider value={{ size: '20', color: editMode ? 'red' : '' }}>
                                                        <CiEdit />
                                                    </IconContext.Provider>
                                                </motion.button>
                                            }
                                            <motion.button animate={{ background: buttonHovering == 'close' ? "whitesmoke" : "transparent" }} onMouseOver={() => setButtonHovering('close')} onMouseOut={() => setButtonHovering('')} className={`p-1 rounded ${ButtonStyle}`} onClick={closeModal}>
                                                <RxCross1 />
                                            </motion.button>
                                        </div>
                                    </Dialog.Title>

                                    <Dialog.Panel className={`text-gray-500 text-xs flex items-center`} >
                                        {
                                            Dates.updated ?
                                                <span>
                                                    Last Updated {formatDate(Dates.updated)}
                                                </span>
                                                :
                                                <span>
                                                    Created {formatDate(Dates.created)}
                                                </span>
                                        }
                                        <div className={`${owner === userData._id ? 'bg-green-500' : 'bg-gray-600'} h-2 w-2 rounded-full mx-2`} ></div>
                                        <div className='flex items-center gap-1'>
                                            <Avatar src={owner.userProfilePicture} size={30} />
                                            <span>
                                                {
                                                    owner._id === userData._id ?
                                                        'Me'
                                                        :
                                                        owner.fullName || owner.userName
                                                }
                                            </span>
                                        </div>
                                    </Dialog.Panel>

                                    <Divider className={` ${theme === 'dark' ? 'bg-white/20' : ''} `} />

                                    <Dialog.Description className={`text-${color}`}>

                                        <span>
                                            <input className={InputStyle} disabled={!editMode} type='text' value={descriptionInputController} onChange={(event) => setDescriptionInputController(event.target.value)} />
                                        </span>

                                    </Dialog.Description>

                                    <Divider className={` ${theme === 'dark' ? 'bg-white/20' : ''} `} />

                                    <h6>Tasks</h6>
                                    <TaskModule tasks={tasks} completedTasks={completedtasks} accentColor={accentColor} />

                                    <Dialog.Panel>
                                        <Contributors contributorsData={people} linkDisabled={false} avatarSize={40} avatarShape={'circle'} bordered={false} borderColor={''} borderSize={0} alignover={true} toLeft={0} toTop={0} onHoverMargin={4} row={true} />
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


const DashboardProject = ({ height, width, project, openModal, isHovered, color, bgColor }: { height: number, width: number, project: Project, openModal: any, isHovered: string, color: string, bgColor: string }) => {

    const { title, description, accentColor, progress, people, attachments, comments } = project

    return (
        <motion.div className={`${bgColor} rounded-3xl p-3 shadow-md hover:shadow-lg hover:shadow-[${accentColor}]`} animate={{ scale: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? 1.02 : isHovered ? 0.8 : 1, opacity: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? 1.06 : isHovered ? 0.8 : 1 }} style={{ height: height || 250, width: width || 250, backdropFilter: isHovered === 'Waiting' && progress <= 10 || isHovered === 'In Progress' && progress > 10 && progress < 100 || isHovered === 'Completed' && progress === 100 || isHovered === 'Total' ? '' : isHovered ? 'blur(100px)' : '', }}>
            <div className='flex justify-between items-center w-full h-[20%]'>
                <div className={`rounded-full w-auto px-3 py-2 flex justify-center items-center cursor-pointer text-sm`} style={{ color: accentColor, backgroundColor: accentColor && convertHexToRGBA(accentColor, 0.2) || 'whitesmoke', }} onClick={openModal} > {title} </div>
                <IconContext.Provider value={{ color: 'gray', size: '20' }}>
                    <RxDotsHorizontal />
                </IconContext.Provider>
            </div>
            <div className=' h-[30%] flex flex-col'>
                <span className='text-left h-full w-full flex items-center '> {description} </span>
            </div>
            <div className='h-[20%]'>
                <span className='w-full flex justify-end' > {progress}% </span>
                <ProgressBar progress={progress} />
            </div>
            <div className=' h-[30%] mt-2 rounded-b-3xl flex justify-between items-start'>
                <div className='inline-flex items-start w-[70%] h-full'>
                    {
                        people &&
                        <Contributors contributorsData={people} avatarSize={35} avatarShape={'circle'} alignover onHoverMargin={0} row linkDisabled bordered={false} borderColor={''} borderSize={0} toLeft={0} toTop={0} />
                    }
                </div>
                <div className=' inline-flex justify-between items-start py-2 w-[30%] h-full text-xs'>
                    <IconContext.Provider value={{ color: color, size: '15' }}>
                        <button className='inline-flex justify-center items-center '>
                            <GiPaperClip />
                            <span className='ml-1'> {attachments} </span>
                        </button>
                        <button className='inline-flex justify-center items-center'>
                            <ChatBubbleOvalLeftEllipsisIcon className={`w-4`} style={{ color: color }} />
                            <span className='ml-1'> {comments} </span>
                        </button>
                    </IconContext.Provider>
                </div>
            </div>

        </motion.div>
    )
}


export default ProjectModule