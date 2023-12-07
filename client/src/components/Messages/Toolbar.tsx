import { useTheme } from '../Contexts'
import { themeColors } from '../utils'
import { IconContext } from 'react-icons'
import { FcVideoCall, FcEmptyTrash, FcPhone } from "react-icons/fc";
import { Divider } from 'antd'
import { Person } from '../Interfaces'
import { profilePicture } from '../../assets';

export default function Toolbar({ profile, active }: { profile: Person, active: boolean }) {

    const { theme } = useTheme()
    const color = themeColors(theme, 'main')

    return (
        <div className={`h-[10%] w-1/2 flex items-center px-4 top-16 left-1/3 rounded-lg absolute backdrop-blur-sm bg-white/20 shadow`}>

            <div className='w-full flex items-center gap-3'>
                <img src={profile.userProfilePicture || profilePicture} alt="" width={50} className={`rounded-full ${active && 'border-2 border-green-400'}`} />
                <div className='w-full flex items-center'>
                    <span className='text-3xl w-full'>{profile.fullName || profile.userName}</span>
                </div>
            </div>

            <div className='flex justify-end gap-3 w-1/2'>
                <IconContext.Provider value={{ color: color, size: '30' }}>

                    <div className='flex'>
                        <button className={`p-1 rounded flex justify-center items-center -rotate-90 hover:bg-white/10`} onClick={() => { }}>
                            <FcPhone />
                        </button>

                        <div className='flex justify-center items-center'>
                            <Divider type='vertical' className='h-5 m-0' />
                        </div>

                        <button className={`rounded p-1 flex justify-center items-center hover:bg-white/10`} onClick={() => { }}>
                            <FcVideoCall />
                        </button>
                    </div>

                    <button className={`rounded p-1 flex justify-center items-center hover:bg-white/10`} onClick={() => { }}>
                        <FcEmptyTrash />
                    </button>

                </IconContext.Provider>
            </div>
        </div >
    )
}
