/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import NotificationModule from './NotificationModule'
import { RxClock } from 'react-icons/rx'
import { CiMail } from 'react-icons/ci'
import { FiChevronDown } from 'react-icons/fi'
import { SlPencil } from 'react-icons/sl'

const NotificationBar = ({ notificationBar, setnotificationBar, color, bgColor }: { notificationBar: boolean, setnotificationBar: (notificationBar: boolean) => void, color: string, bgColor: string }) => {

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
        <motion.div initial={{ height: 0 }} animate={{ height: notificationBar ? 635 : 185 }} transition={{ duration: 0.5 }} id='youknowwhat' className={` w-full ${bgColor} text-${color} mt-[15px] rounded-3xl`}>
            <button className='bg-[#f2f6fb]/20 backdrop-blur-lg w-full h-6 flex justify-center items-center rounded-t-3xl' onClick={() => setnotificationBar(!notificationBar)}>
                {
                    notificationBar ?
                        <ChevronDownIcon width={30} />
                        :
                        <ChevronUpIcon width={30} />
                }
            </button>
            <div className={`w-full ${notificationBar ? `h-[611px]` : `h-[161px]`} relative rounded-b-3xl flex flex-col select-span`}>
                <div className={`w-full h-full max-h-[1000px] absolute transition-all ease-linear rounded-b-3xl ${notificationBar ? 'overflow-y-scroll' : 'overflow-hidden'} `}>
                    {
                        notificationData.map((notification: any, index: number) => {
                            return (
                                <div key={index}>
                                    <NotificationModule notification={notification} height={notificationBar ? 80 : 0} />
                                    {
                                        index != notificationData.length - 1 &&
                                        <div className={`bg-[#f5f5f5] h-[1px] w-full rounded-full`} />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </motion.div>
    )
}

export default NotificationBar