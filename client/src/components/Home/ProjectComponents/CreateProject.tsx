/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from 'react'
//AppComponents
import AutoExpandingInput from './AutoExpandingInput'
//OtherComponents
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Steps, DatePicker } from 'antd'
import { useFilePicker } from 'use-file-picker';
import {
    FileAmountLimitValidator,
    FileTypeValidator,
    FileSizeValidator,
    ImageDimensionsValidator,
} from 'use-file-picker/validators';
//Icons
import { VscClose } from 'react-icons/vsc'
import { PiStickerLight } from 'react-icons/pi'
import { themeColors } from '../../utils'
import { useTheme } from '../../Contexts/'
import dayjs, { Dayjs } from 'dayjs'
import { RangeValue } from 'rc-picker/lib/interface'

export default function CreateProject(props: any) {

    const [isOpen, setIsOpen] = useState(false)
    const [titleInput, settitleInput] = useState('')
    const [description, setDescription] = useState('')
    const [tasksInput, setTasksInput] = useState('')
    const [tasksData, setTasksData] = useState<Array<string>>([])
    const [completedTasksInput, setCompletedTasksInput] = useState('')
    const [completedTasks, setCompletedTasks] = useState<Array<string>>([])
    const [durationDates, setDurationDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([dayjs(), null])

    const { theme } = useTheme()
    const color = themeColors(theme, 'main')

    const { RangePicker } = DatePicker;

    const { openFilePicker, filesContent } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: true,
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['jpg', 'png']),
            new FileSizeValidator({ maxFileSize: 5 * 1024 * 1024 /* 5 MB */ }),
            new ImageDimensionsValidator({
                maxHeight: 1000, // in pixels
                maxWidth: 1600,
                minHeight: 10,
                minWidth: 10,
            }),
        ],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onDurationDatesChange = (values: RangeValue<Dayjs>, _formatString: [string, string]) => {
        setDurationDates(values as [dayjs.Dayjs, dayjs.Dayjs])
    };

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
        setDescription('')
        setTasksInput('')
        setTasksData([])
        setCompletedTasksInput('')
        setCompletedTasks([])
        setDurationDates(null)
    }

    const closeModule = () => {
        setIsOpen(false)
        props.loadNewData()
        reset()
    }

    const handleDialogClose = () => {
        reset()
        setIsOpen(false)
    }


    return (
        <>
            <div className=" flex items-center justify-center pl-4 text-white ">
                <motion.button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className={`rounded-xl bg-selectedicon px-3 py-2 focus:outline-none`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Create Project
                </motion.button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleDialogClose}>
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
                                <Dialog.Panel className={`w-[80%] min-h-[300px] transform overflow-hidden rounded-xl ${'bg-white'} text-${color} p-2 span-left align-middle shadow-xl transition-all`}>

                                    <div className='h-[800px] w-full'>

                                        <div className='w-full flex justify-end'>
                                            <button onClick={closeModule}>
                                                <VscClose size={20} />
                                            </button>
                                        </div>

                                        <div className='w-full h-[100%] flex px-4'>

                                            <div className='h-full w-[60%] p-5'>

                                                <div className='flex w-full'>
                                                    <motion.button whileHover={{ scale: 1.1 }} className={`w-[60px] h-[60px] rounded-[14px] flex justify-center items-center ${filesContent.length > 0 ? 'bg-transparent' : 'bg-[#25282d]'}`} onClick={openFilePicker}>
                                                        {
                                                            filesContent.length > 0 ?
                                                                filesContent.map((file, index) => (
                                                                    <div key={index} className='flex justify-center items-center'>
                                                                        <img alt={file.name} src={file.content} width={60} height={60} className='rounded-lg' />
                                                                        <br />
                                                                    </div>
                                                                ))
                                                                :
                                                                <PiStickerLight size={30} color={'gray'} />
                                                        }
                                                    </motion.button>

                                                    <div className='flex max-h-[40%] justify-center p-2 w-[80%]'>
                                                        <AutoExpandingInput className={'w-full overflow-y-scroll focus:outline-none bg-transparent text-3xl'} placeholder={'Project Title'} inputValue={titleInput} setInputValue={settitleInput} />
                                                    </div>
                                                </div>


                                                <div className='flex flex-col justify-between mt-2 w-full'>
                                                    <RangePicker size='middle' allowClear bordered style={{ width: '30%', outline: 'none' }} format={'DD-MM-YY'} defaultValue={[dayjs(), null]} value={durationDates} onChange={onDurationDatesChange} className='rounded-full px-3' />

                                                    <span className='text-xs mx-2 text-gray-500'>Project Duration <b>{durationDates != null && durationDates[1] != null ? durationDates[1].diff(durationDates[0], 'day') : 'unknown'}</b> Days</span>

                                                    <span id='starting' className='text-xs mx-2 text-gray-500'>Starting <b>{durationDates != null && durationDates[0] != null ? durationDates[0].isSame(dayjs(), 'day') ? 'Today' : durationDates![0]?.toDate().toLocaleString('en-US', { weekday: 'long' }) : 'idk'}</b></span>
                                                </div>


                                            </div>


                                            <div className='w-[40%] flex justify-center items-center'>

                                                <div className='w-[70%] h-[70%] rounded-lg bg-white border shadow-black shadow-lg flex'>

                                                    <div className='bg-red-500 pl-8 flex justify-center items-center'>
                                                        <Steps
                                                            direction="vertical"
                                                            size="small"
                                                            current={0}
                                                            items={[
                                                                { title: 'Give a Name', description: `Let's start with the Project Name` },
                                                                {
                                                                    title: 'Choose Project Duration',
                                                                    description: `Choose the duration of the project starting from today`,
                                                                },
                                                                {
                                                                    title: 'Add People',
                                                                    description: `Add people to the project`,
                                                                },
                                                            ]}
                                                        />
                                                    </div>

                                                </div>

                                            </div>

                                        </div>

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