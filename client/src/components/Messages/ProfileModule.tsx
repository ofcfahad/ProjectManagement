import { Person } from '../Interfaces'
import { Badge } from 'antd'
import { useTheme } from '../Contexts'
import { themeColors } from '../utils'
import { motion } from 'framer-motion'
import { profilePicture } from '../../assets'

export default function ProfileModule({ profile, selected }: { profile: Person, selected: boolean }) {

    const { theme } = useTheme()
    const color = themeColors(theme, 'main')

    const areActive: string[] = ['2']

    return (
        <div className={`flex w-full focus:outline-none relative ${selected
            ? `shadow border-l-2 border-green-400`
            : `${theme === 'dark' && 'hover:bg-opacity-10'} hover:bg-[#f5f5f5]`} justify-between p-2 text-${color} `}>

            <motion.div
                className={`${theme === 'dark' ? 'bg-[#8799A3]' : 'bg-[#f2f6fe]'} h-full w-full absolute top-0 left-0`}
                initial={{ width: '0%' }}
                animate={{ width: selected ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
            />

            <div className='flex relative'>
                <Badge color="green" offset={[-5, 40]} dot={areActive.includes(profile._id)} >
                    <div className='rounded-full'>
                        <img src={profile.userProfilePicture || profilePicture} alt="userpfp" width={50} className='rounded-full' />
                    </div>
                </Badge>

                <div className={`flex flex-col items-center ml-2 mt-1`}>
                    <span className='text-lg'>
                        {profile.fullName || profile.userName}
                    </span>

                    <span className={`text-xs flex justify-start w-full ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`}>
                        @{profile.userName}
                    </span>
                </div>
            </div>

            <div className='flex flex-col relative justify-start items-start'>
                <span className='text-[10px] font-ubuntu'>
                    {
                        //profile.dates.lastMessage?.toString() ??
                        'No messages yet'
                    }
                </span>

            </div>

        </div>
    )
}