import React, { useEffect, useState, Fragment } from 'react'
//AppComponents
import OptionsModal from './OptionsModal'
import Contributors from './Contributors'
//OtherComponents
import { motion } from 'framer-motion'
import { Dialog, Transition } from '@headlessui/react'
//Icons
import { IconContext } from 'react-icons'
import { CiEdit, CiTrash } from 'react-icons/ci'
import { GiPaperClip } from 'react-icons/gi'
import { ChatBubbleOvalLeftEllipsisIcon, } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import axios from 'axios'



const ProjectModule = ({ project, height, width, title, titleColor, description, progress, people, attachments, comments, setLoadNewData }) => {
    const [isOpen, setIsOpen] = useState(false)

    const session = Cookies.get('session')

    const handleProjectDeletion = async (projectId: string) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/deleteProject`, { projectId }, {
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
        handleProjectDeletion(project._id)
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div className="flex items-center justify-center" >
                <Project height={undefined} width={undefined} title={undefined} titleColor={undefined} description={undefined} progress={undefined} people={undefined} attachments={undefined} comments={undefined} project={project} setLoadNewData={setLoadNewData} deleteProject={deleteProject} openModal={openModal} />
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
                                        Payment successful
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Your payment has been successfully submitted. We’ve sent
                                            you an email with all of the details of your order.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}


const Project = ({ height, width, title, titleColor, description, progress, people, attachments, comments, project, setLoadNewData, deleteProject, openModal }) => {

    //const [animatedProgress, setAnimatedProgress] = useState(0)

    const menuOptions = [
        {
            id: 1,
            text: 'Delete',
            icon: <CiTrash />,
        },
        {
            id: 2,
            text: 'Edit',
            icon: <CiEdit />,
        },
    ]



    // useEffect(() => {
    //     // Animate progress from 0 to the desired value
    //     const animationInterval = setInterval(() => {
    //         setAnimatedProgress((prevProgress) => {
    //             if (prevProgress >= project.progress) {
    //                 clearInterval(animationInterval);
    //                 return project.progress;
    //             }
    //             return prevProgress + 10;
    //         });
    //     }, 100);

    //     // Clean up animation interval when component unmounts
    //     return () => clearInterval(animationInterval);
    // }, [project.progress]);


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
                <div className={` rounded-full  w-auto px-2 py-1 flex justify-center items-center cursor-pointer`} style={{ color: titleColor, backgroundColor: titleColor && convertHexToRGBA(titleColor) || 'whitesmoke', }} onClick={openModal} > {project.title} </div>
                <OptionsModal deleteProject={deleteProject} setLoadNewData={setLoadNewData} projectTitle={project.title} />
            </div>
            <div className=' h-[30%] flex flex-col px-2 '>
                <span className='text-left h-full w-full flex items-center '> {project.description} </span>
            </div>
            <div className=' h-[20%] px-2 '>
                <span className='w-full flex justify-end' > {project.progress}% </span>

                <div style={{ width: '100%', height: '10px', backgroundColor: '#f6f5f8', borderRadius: '999px' }}>
                    <motion.div
                        style={{ backgroundColor: '#734ae3', height: '100%', width: 0, borderRadius: '100px' }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </div>
            <div className=' h-[30%] rounded-b-3xl flex justify-between px-2 '>
                <div className='inline-flex items-center w-[70%]'>
                    <Contributors key={project.people.name} contributorsData={project.people} avatarSize={35} avatarShape={'rounded-circle'} alignover={true} onHoverMargin={10} row linkDisabled name={undefined} profilelink={undefined} avatar={undefined} bordered={undefined} borderColor={undefined} borderSize={undefined} toLeft={undefined} toTop={undefined} customTailwindforParentDiv={undefined} customTailwindforAvatar={undefined} />
                </div>
                <div className=' inline-flex justify-between w-[30%] text-xs '>
                    <IconContext.Provider value={{ color: 'black', size: '15' }}>
                        <button className='inline-flex justify-center items-center '>
                            <GiPaperClip />
                            <span> {project.attachments} </span>
                        </button>
                        <button className='inline-flex justify-center items-center'>
                            <ChatBubbleOvalLeftEllipsisIcon className='w-4 text-black' />
                            <span> {project.comments} </span>
                        </button>
                    </IconContext.Provider>
                </div>
            </div>

        </div>
    )
}


export default ProjectModule