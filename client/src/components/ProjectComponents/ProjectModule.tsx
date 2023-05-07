/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Fragment, useEffect } from 'react'
//AppComponents
import OptionsModal from './OptionsModal'
import Contributors from './Contributors'
//OtherComponents
import { motion } from 'framer-motion'
import { Dialog, Transition } from '@headlessui/react'
//Icons
import { IconContext } from 'react-icons'
import { GiPaperClip } from 'react-icons/gi'
import { ChatBubbleOvalLeftEllipsisIcon, } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import axios from 'axios'



const ProjectModule = ({ project, setLoadNewData }: { project: any, setLoadNewData: any }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [peopleData, setPeopleData] = useState<Array<object>>()

    const session = Cookies.get('session')
    const { _id, title, description, accentColor, tasks, completedTasks, progress, Owner, people, attachments, comments } = project

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
                <Project setLoadNewData={setLoadNewData} deleteProject={deleteProject} openModal={openModal} title={title} description={description} accentColor={accentColor} progress={progress} people={peopleData} comments={comments} attachments={attachments} height={0} width={0} />
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
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Project
                                    </Dialog.Title>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}


const Project = ({ height, width, title, description, accentColor, progress, people, comments, attachments, setLoadNewData, deleteProject, openModal }: { height: number, width: number, title: string, description: string, accentColor: string, progress: number, people: any, comments: any, attachments: any, setLoadNewData: any, deleteProject: any, openModal: any }) => {

    const convertHexToRGBA = (hexCode: string) => {
        let hex = hexCode.replace('#', '');

        if (hex.length === 3) {
            hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `rgba(${r},${g},${b},${0.2})`;
    };

    return (
        <div className={`bg-white rounded-3xl`} style={{ height: height || 250, width: width || 250 }} >
            <div className='flex justify-between items-center w-full h-[20%] px-2 mt-1 rounded-t-3xl '>
                <div className={` rounded-full  w-auto px-2 py-1 flex justify-center items-center cursor-pointer`} style={{ color: accentColor, backgroundColor: accentColor && convertHexToRGBA(accentColor) || 'whitesmoke', }} onClick={openModal} > {title} </div>
                <OptionsModal deleteProject={deleteProject} setLoadNewData={setLoadNewData} projectTitle={title} />
            </div>
            <div className=' h-[30%] flex flex-col px-2 '>
                <span className='text-left h-full w-full flex items-center '> {description} </span>
            </div>
            <div className=' h-[20%] px-2 '>
                <span className='w-full flex justify-end' > {progress}% </span>

                <div style={{ width: '100%', height: '10px', backgroundColor: '#f6f5f8', borderRadius: '999px' }}>
                    <motion.div
                        style={{ backgroundColor: '#734ae3', height: '100%', width: 0, borderRadius: '100px' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </div>
            <div className=' h-[30%] rounded-b-3xl flex justify-between px-2 '>
                <div className='inline-flex items-center w-[70%]'>
                    {
                        people &&
                        <Contributors contributorsData={people} avatarSize={35} avatarShape={'rounded-circle'} alignover={true} onHoverMargin={10} row linkDisabled bordered={false} borderColor={''} borderSize={0} toLeft={0} toTop={0} />
                    }
                </div>
                <div className=' inline-flex justify-between w-[30%] text-xs '>
                    <IconContext.Provider value={{ color: 'black', size: '15' }}>
                        <button className='inline-flex justify-center items-center '>
                            <GiPaperClip />
                            <span> {attachments} </span>
                        </button>
                        <button className='inline-flex justify-center items-center'>
                            <ChatBubbleOvalLeftEllipsisIcon className='w-4 text-black' />
                            <span> {comments} </span>
                        </button>
                    </IconContext.Provider>
                </div>
            </div>

        </div>
    )
}


export default ProjectModule