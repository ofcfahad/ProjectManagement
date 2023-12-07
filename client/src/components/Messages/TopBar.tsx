/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { IconContext } from 'react-icons'
import { CiSun, CiDark, CiCalendar, CiBellOn, CiBellOff } from 'react-icons/ci'
import { RxDividerVertical } from 'react-icons/rx'
import SearchBar from '../SearchBar'
import { useTheme, useUserData } from '../Contexts'
import { themeColors } from '../utils'
import MenuButton from '../MenuButton'
import { profilePicture } from '../../assets'

const TopBar = (props: any) => {

    const { searchContent, setsearchContent } = props
    const { theme, toggleTheme } = useTheme()

    const { getUserData } = useUserData()
    const userData = getUserData()

    const color = themeColors(theme, 'main')

    return (
        <div className='w-full items-center justify-between px-4 flex'>
            <IconContext.Provider value={{ color: color, size: '20' }}>

                {/* LEFT */}
                <div className='flex h-full items-center gap-2'>

                    {/* MENUBUTTON */}
                    <div className='flex items-center'>
                        <MenuButton />
                    </div>

                    {/* SEARCHBAR */}
                    <div className='h-3/4'>
                        <SearchBar searchContent={searchContent} setsearchContent={setsearchContent} onSearchIconClick={() => { }} onCrossIconClick={() => { }} />
                    </div>

                </div>

                {/* RIGHT */}
                <div className={`h-full flex`}>

                    {/* OTHERS */}
                    <div className='flex gap-3 items-center'>
                        <IconContext.Provider value={{ size: '25', color: color }}>

                            {/* THEME */}
                            <button onClick={toggleTheme}>
                                {
                                    theme === 'dark' ?
                                        <CiSun />
                                        :
                                        <CiDark />
                                }
                            </button>

                            {/* NOTIS */}
                            <button onClick={() => { }} disabled={window.innerWidth >= 1060 ? false : true}>
                                {
                                    // eslint-disable-next-line no-constant-condition
                                    true ?
                                        <CiBellOn />
                                        :
                                        <CiBellOff />
                                }
                            </button>

                            {/* CALENDER */}
                            <button>
                                <CiCalendar />
                            </button>

                        </IconContext.Provider>
                    </div>

                    {/* SEPERATOR */}
                    <div className='flex justify-center items-center'>
                        <IconContext.Provider value={{ color: 'gray', size: '30' }}>
                            <RxDividerVertical />
                        </IconContext.Provider>
                    </div>

                    {/* PROFILE */}
                    <Listbox value={userData?.userName}>
                        <Listbox.Button className="flex gap-1 relative items-center cursor-default rounded-lg bg-transparent hover:shadow-md focus:outline-none">
                            <img src={userData?.userProfilePicture || profilePicture} className=" h-10 w-10 rounded-full" />
                            <span className="text-sm" style={{ color: color }}> {userData.fullName || userData.userName} </span>
                            <ChevronDownIcon
                                className={`w-5`}
                                style={{ color: color }}
                            />
                        </Listbox.Button>
                    </Listbox>

                </div>
            </IconContext.Provider>
        </div>
    )
}

export default TopBar