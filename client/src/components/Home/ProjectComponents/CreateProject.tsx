/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useCallback, useEffect, useState, useContext } from 'react'
//OtherComponents
import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Tooltip } from 'antd'
//Icons
import { IconContext } from 'react-icons'
import { VscDebugAll } from 'react-icons/vsc'
import { RxCross1 } from 'react-icons/rx'
import { HiPlus } from 'react-icons/hi2'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Info } from '../../'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ThemeContext } from '../../Contexts/ThemeContext'
import { themeColors } from '../../functions'
import { Project } from '../../interfaces'

export default function CreateProject(props: any) {

    const { userId } = props
    const { theme } = useContext(ThemeContext)
    const bgColor = themeColors(theme, 'background')
    const color = themeColors(theme, 'main')

    const defaultProject: Project = {
        title: '',
        description: '',
        accentColor: 'white',
        tasks: [''],
        completedtasks: [''],
        progress: 0,
        owner: userId,
        people: [''],
        Dates: {},
        attachments: 0,
        comments: 0,
    };

    const [isOpen, setIsOpen] = useState(false)
    const [titleInput, settitleInput] = useState('')
    const [projectTitle, setProjectTitle] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [description, setDescription] = useState('')
    const [tasksInput, setTasksInput] = useState('')
    const [tasksData, setTasksData] = useState<Array<string>>([])
    const [completedTasksInput, setCompletedTasksInput] = useState('')
    const [completedTasks, setCompletedTasks] = useState<Array<string>>([])
    const [finalProject, setFinalProject] = useState<Project>(defaultProject)
    const [optionSelected, setoptionSelected] = useState(props.reference === 'main' ? 'started' : props.reference)
    const [secondIsOpen, setSecondIsOpen] = useState(false)
    const [handleSubmit, setHandleSubmit] = useState(false);


    const handleTasksInput = (event: any) => {
        setTasksInput(event.target.value)
    }


    const handleNewTask = () => {
        if (tasksData.length <= 10) {
            setTasksData([...tasksData, tasksInput]);
            setTasksInput('');
        }
    }

    const handleDeleteTask = (value: string) => {
        const filteredTasksData = tasksData.filter((data) => data != value);
        const filteredTasksDatax2 = completedTasks.filter((data) => data != value);
        setTasksData(filteredTasksData)
        setCompletedTasks(filteredTasksDatax2)
    }

    const handleCompletedTask = () => {
        const completedTask = tasksData.includes(completedTasksInput) ? completedTasksInput : ''
        setCompletedTasks([...completedTasks, completedTask]),
            setCompletedTasksInput('')
    }

    const reset = () => {
        settitleInput('')
        setProjectTitle('')
        setDescriptionInput('')
        setDescription('')
        setTasksInput('')
        setTasksData([])
        setCompletedTasksInput('')
        setCompletedTasks([])
        setFinalProject(defaultProject)
        setoptionSelected('started')
        setHandleSubmit(false)
    }

    const session = Cookies.get('session')

    const handleProjectPost = useCallback(async () => {
        if (Object.keys(finalProject).length !== 0) {
            try {
                await axios.post(`/server/api/createProject`, { finalProject }, { headers: { Authorization: session } });
            } catch (error) {
                console.log(`from handleProjectPost: ${error}`);
            }
        }
    }, [finalProject, reset])


    const onSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setHandleSubmit(true)
        setSecondIsOpen(true);
        const data = {
            title: projectTitle,
            description: description || `it is ${projectTitle}`,
            progress: ~~((completedTasks.length / tasksData.length) * 100),
            accentColor: ((completedTasks.length / tasksData.length) * 100) === 100 ? '#e5af07' : ((completedTasks.length / tasksData.length) * 100) >= 10 ? '#fd68b3' : '#7249e0',
            tasks: tasksData,
            completedtasks: completedTasks,
            owner: userId,
            Dates: {
                created: Date.now()
            },
            people: [userId],
            attachments: 0,
            comments: 0
        }
        setFinalProject(data);
    };

    useEffect(() => {
        if (handleSubmit) {
            handleProjectPost()
        }
    }, [handleSubmit, handleProjectPost]);


    const closeModule = () => {
        setSecondIsOpen(false)
        setIsOpen(false)
        props.setLoadNewData(true)
        reset()
    }

    const createDummyProject = () => {
        setProjectTitle('testing'),
            setDescription('its just a test description'),
            setTasksData(['task1', 'task2', 'task3']),
            setCompletedTasks(optionSelected === 'completed' ? ['task1', 'task2', 'task3'] : optionSelected === 'ongoing' ? ['task1', 'task2'] : [])
    }

    const handleDialogClose = () => {
        reset()
        setIsOpen(false)
    }

    return (
        <>
            <div className=" flex items-center justify-center pl-4 text-white ">
                {
                    props.reference === 'main' ?
                        <motion.button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="rounded-full bg-selectedicon px-3 py-2 span-white focus:outline-none "
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create Project
                        </motion.button>
                        :
                        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} transition={{ duration: 0 }} className={` ${theme === 'dark' ? 'bg-[#4c5e81]' : 'bg-[#f5f5f5]'} backdrop-blur-sm rounded-full h-[25px] w-[25px] flex justify-center items-center  ${props.reference === 'started' ? 'hover:bg-selectedicon hover:shadow-selectedicon' : props.reference === 'ongoing' ? 'hover:bg-pink-400 hover:shadow-pink-400' : props.reference === 'completed' ? 'hover:bg-yellow-400 hover:shadow-yellow-400 ' : null} hover:shadow-sm backdrop-blur-sm transition-all ease-linear`} onClick={() => setIsOpen(true)} > <IconContext.Provider value={{ color: color, size: '15' }} > <HiPlus /> </IconContext.Provider> </motion.button>
                }
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                        <div className="flex min-h-full items-center justify-center p-4 span-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${bgColor} text-${color} p-6 span-left align-middle shadow-xl transition-all`}>
                                    <div className='flex justify-between items-center'>
                                        <Dialog.Title
                                            as='h2'
                                            className="span-3xl span-gray-900"
                                        >
                                            Create Project
                                        </Dialog.Title>
                                        <button onClick={createDummyProject} >
                                            <VscDebugAll />
                                        </button>
                                    </div>
                                    <div className='flex flex-col justify-between'>
                                        <div className="mt-2 flex justify-between">
                                            <Dialog.Title as='h6' className="span-lg font-medium leading-6 span-gray-900" >Title</Dialog.Title>
                                            <Tooltip title={tasksData.length <= 10 ? '' : 'You can add more tasks later'} placement='top' color='red' trigger={'focus'} >
                                                <div className='flex w-[54%] rounded-full border justify-between items-center px-2 focus:outline focus:outline-2 focus:outline-black'>
                                                    <input type="span" placeholder={'here'} value={titleInput} onChange={(event) => settitleInput(event?.target?.value ?? '')} className=' rounded-3xl px-3 focus:outline-none w-[95%] ' />
                                                    {
                                                        titleInput &&
                                                        <AnimatePresence>
                                                            <motion.button disabled={projectTitle.length > 0} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => { setProjectTitle(titleInput); settitleInput(''); }} >
                                                                <ArrowRightIcon className='w-4' />
                                                            </motion.button>
                                                        </AnimatePresence>
                                                    }
                                                </div>
                                            </Tooltip>
                                        </div>

                                        {
                                            projectTitle &&
                                            <div className='w-auto'>
                                                <CustomBar content={projectTitle} reference={setProjectTitle} setTitle={setProjectTitle} optionSelected={optionSelected} />
                                            </div>
                                        }

                                        <div className="mt-2 flex justify-between">
                                            <Dialog.Title as='h6' className="span-lg font-medium leading-6 span-gray-900" >Description</Dialog.Title>
                                            <Tooltip title={tasksData.length <= 10 ? '' : 'You can add more tasks later'} placement='top' color='red' trigger={'focus'} >
                                                <div className='flex w-[54%] rounded-full border justify-between items-center px-2 focus:outline focus:outline-2 focus:outline-black'>
                                                    <input type="span" placeholder={'here'} value={descriptionInput} onChange={(event) => setDescriptionInput(event?.target?.value ?? '')} className=' rounded-3xl px-3 focus:outline-none w-[95%] ' />
                                                    {
                                                        descriptionInput &&
                                                        <AnimatePresence>
                                                            <motion.button disabled={description.length > 0} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => { setDescription(descriptionInput); setDescriptionInput(''); }} >
                                                                <ArrowRightIcon className='w-4' />
                                                            </motion.button>
                                                        </AnimatePresence>
                                                    }
                                                </div>
                                            </Tooltip>
                                        </div>

                                        <div className='mt-3 mb-3'>
                                            {
                                                description &&
                                                <CustomBar content={description} reference={setDescription} setTitle={undefined} optionSelected={optionSelected} />
                                            }
                                        </div>

                                        <div className="mt-2 flex justify-between">
                                            <Dialog.Title as='h6' className="span-lg font-medium leading-6 span-gray-900" >Tasks</Dialog.Title>
                                            <Tooltip title={tasksData.length <= 10 ? '' : 'You can add more tasks later'} placement='top' color='red' trigger={'focus'} >
                                                <div className='flex w-[54%] rounded-full border justify-between items-center px-2 focus:outline focus:outline-2 focus:outline-black'>
                                                    <input type="span" placeholder={'here'} value={tasksInput} onChange={handleTasksInput} className=' rounded-3xl px-3 focus:outline-none w-[95%] ' />
                                                    {
                                                        tasksInput &&
                                                        <AnimatePresence>
                                                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={handleNewTask} >
                                                                <ArrowRightIcon className='w-4' />
                                                            </motion.button>
                                                        </AnimatePresence>
                                                    }
                                                </div>
                                            </Tooltip>
                                        </div>

                                        <div className="mt-4 flex justify-between">
                                            <div className={` flex flex-wrap `}>
                                                {
                                                    tasksData.map((task) => (
                                                        <div key={task} className={` mr-4 py-2 `}>
                                                            <TaskButton task={task} handleDeleteTask={handleDeleteTask} completedTasks={completedTasks} theme={theme} />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>

                                        {
                                            optionSelected != 'started' ?
                                                <div className="mt-4 flex justify-between">
                                                    <Dialog.Title as='h6' className="span-lg font-medium leading-6 span-gray-900" >Completed Tasks</Dialog.Title>
                                                    <div className='flex w-[54%] rounded-full border justify-between items-center px-2 focus:outline focus:outline-2 focus:outline-black'>
                                                        <Tooltip title={tasksData.length <= 10 ? '' : 'You can add more tasks later'} placement='top' color='red' trigger={'focus'} >
                                                            <input type="span" placeholder={'here'} value={completedTasksInput} onChange={(event) => setCompletedTasksInput(event?.target?.value ?? '')} className=' rounded-3xl px-3 focus:outline-none w-[95%] ' />
                                                        </Tooltip>
                                                        {
                                                            completedTasksInput &&
                                                            <AnimatePresence>
                                                                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={handleCompletedTask} >
                                                                    <ArrowRightIcon className='w-4' />
                                                                </motion.button>
                                                            </AnimatePresence>
                                                        }
                                                    </div>
                                                </div>
                                                : null
                                        }

                                        <div className='mt-4 span-black '>
                                            <Dialog.Title as='h6' className="span-lg font-medium leading-6 span-gray-900" > Category </Dialog.Title>
                                            <div className='flex justify-between'>
                                                <OptionButton
                                                    label={'Started'}
                                                    value={'started'}
                                                    selected={optionSelected}
                                                    onChange={setoptionSelected}
                                                    toolTip={'For new Projects'}
                                                />

                                                <OptionButton
                                                    label={'On Going'}
                                                    value={'ongoing'}
                                                    selected={optionSelected}
                                                    onChange={setoptionSelected}
                                                    toolTip={'For already started Projects > 10% '}
                                                />

                                                <OptionButton
                                                    label={'Completed'}
                                                    value={'completed'}
                                                    selected={optionSelected}
                                                    onChange={setoptionSelected}
                                                    toolTip={'Completed is it?'}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mt-4 flex justify-between items-center " style={{ color: 'black' }} >

                                        <motion.button
                                            type="button"
                                            className="inline-flex justify-center items-center rounded-md border border-transparent bg-red-100 px-4 py-2 span-sm font-medium span-blue-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleDialogClose}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className='mr-2'>
                                                Close
                                            </span>
                                            <IconContext.Provider value={{ color: 'gray', size: '15' }}>
                                                <RxCross1 />
                                            </IconContext.Provider>
                                        </motion.button>


                                        <Info button={
                                            <motion.button
                                                type="button"
                                                className="flex justify-around items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 span-sm font-medium span-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={onSubmit}
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <span>
                                                    Do it !
                                                </span>
                                                <ArrowRightIcon className='w-4 ml-2' />
                                            </motion.button>
                                        } title={<span>Project <b>{projectTitle}</b> Created </span>} isOpen={secondIsOpen} onClose={closeModule} description={''} />

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div >
                </Dialog >
            </Transition >
        </>
    )
}

function OptionButton({ label, value, selected, onChange, toolTip }: { label: string, value: string, selected: string, onChange: any, toolTip: string }) {
    return (
        <Tooltip placement='top' title={toolTip} mouseEnterDelay={1} mouseLeaveDelay={0}>
            <motion.button
                initial={{ background: 'whitesmoke', scale: 0.9 }}
                animate={{ background: selected === value ? 'linear-gradient(to right, #316bb4, #ba7aae, #e0a72f)' : 'linear-gradient(to right, gray, #00000033)', scale: 1 }}
                whileHover={{ scale: 1.1, }}
                transition={{ duration: 0.5 }}
                className={` px-3 py-2 rounded-full text-xs span-black backdrop-blur-sm `}
                onClick={() => onChange(value)}
            >
                {label}
            </motion.button>
        </Tooltip>
    );
}

const TaskButton = ({ task, handleDeleteTask, completedTasks, theme }: { task: string, handleDeleteTask: any, completedTasks: Array<string>, theme: string }) => {
    return (
        <div className=' flex justify-between items-center rounded-full px-2 py-1 text-[10px] ' style={{ background: completedTasks.includes(task) ? 'rgba(0, 255, 0, 0.2)' : theme === 'dark' ? 'black' : 'whitesmoke' }} >
            <span>
                {task}
            </span>
            <button className='ml-2' onClick={() => handleDeleteTask(task)} >
                <RxCross1 />
            </button>
        </div>
    )
}

const CustomBar = ({ content, reference, optionSelected, setTitle }: { content: string, reference: any, optionSelected: string, setTitle: any }) => {
    return (
        <div className='flex flex-wrap'>
            <div className='px-3 py-2 rounded-full flex justify-between items-center' style={{ background: reference != setTitle ? 'whitesmoke' : optionSelected === 'started' ? 'rgba(115,74,227,0.2)' : optionSelected === 'ongoing' ? 'rgba(241,112,179,0.2)' : 'rgba(231,176,7,0.2)', color: reference != setTitle ? 'black' : optionSelected === 'started' ? 'rgba(115,74,227,1)' : optionSelected === 'ongoing' ? 'rgba(241,112,179,1)' : 'rgba(231,176,7,1)' }} >
                <span>
                    {content}
                </span>
                <button className='ml-2' onClick={() => reference('')} >
                    <RxCross1 />
                </button>
            </div>
        </div>
    )
}