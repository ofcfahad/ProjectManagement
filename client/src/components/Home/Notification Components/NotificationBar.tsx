/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import NotificationModule from './NotificationModule'

const NotificationBar = (props: any) => {

    const { notificationBar, setnotificationBar, notificationData, color, bgColor } = props

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
                    <NotificationModule notificationData={notificationData} height={0} icon={undefined} actionIcon={undefined} iconBackgroundColor={''} title={''} description={''} />
                </div>
            </div>
        </motion.div>
    )
}

export default NotificationBar