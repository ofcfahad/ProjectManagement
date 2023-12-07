/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useCallback, useRef, useState } from 'react'
//AppComponents
//OtherComponents
import { Dialog, Transition } from '@headlessui/react'
//Icons
import { VscClose } from 'react-icons/vsc'
import axios from 'axios'
import Cookies from 'js-cookie'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { IconContext } from 'react-icons'
import { useTheme } from '../Contexts'
import { themeColors } from '../utils'
import { debounce } from 'lodash'
import { Mentions } from 'antd'
import { profilePicture } from '../../assets'

export default function CreateChat(props: any) {

    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<{ user_id: string; user_name: string; avatar_url: string }[]>([]);

    const { theme } = useTheme()
    const bgColor = themeColors(theme, 'background')
    const color = themeColors(theme, 'main')
    const session = Cookies.get('session')

    const ref = useRef<string>();

    const findUserNames = async (key: string) => {
        if (!key) {
            setUsers([]);
            return;
        }

        const response = await axios.post(`/server/api/findUserNames`, { userName: key }, { headers: { Authorization: session } })

        setUsers(response.data.slice(0, 10));
        setLoading(false)
    };

    const debounceFindUserNames = useCallback(debounce(findUserNames, 1000), []);

    const onSearch = (search: string) => {
        ref.current = search;
        setLoading(!!search);
        setUsers([]);

        debounceFindUserNames(search);
    };

    const onUserSelect = (option: any, prefix: string) => {
        props.addNewChat(option.key)
        handleDialogClose()
    }

    const handleDialogClose = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className=" flex items-center justify-center pl-4 text-white ">
                <button className={`w-[30px] h-[30px] rounded flex justify-center items-center ${theme === 'dark' ? 'hover:bg-white/30' : 'hover:bg-gray-200'}`} onClick={() => setIsOpen(true)}>
                    <IconContext.Provider value={{ color: color, size: '20' }}>
                        <HiOutlinePencilSquare />
                    </IconContext.Provider>
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleDialogClose}>
                    {/* <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/20 backdrop-blur" />
                    </Transition.Child> */}

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
                                <Dialog.Panel className={`w-1/2 rounded-xl flex fixed top-16 bg-white text-${color} p-3 span-left shadow-xl transition-all`}>

                                    <div className='w-full'>
                                        <Mentions
                                            style={{ width: '100%' }}
                                            placeholder='Enter Username'
                                            className='w-full focus:outline-none outline-none border-none'
                                            loading={loading}
                                            onSearch={onSearch}
                                            onSelect={onUserSelect}
                                            options={
                                                users.map(({ user_id, user_name, avatar_url: avatar }) => ({
                                                    key: user_id,
                                                    value: user_name,
                                                    className: 'antd-demo-dynamic-option',
                                                    label: (
                                                        <div className='flex items-center gap-2'>
                                                            <img src={avatar || profilePicture} alt={user_name} width={20} className='rounded-full' />
                                                            <span>{user_name}</span>
                                                        </div>
                                                    ),
                                                }))
                                            }
                                        />
                                        {/* <input type="text" placeholder='Enter Username' className='w-full focus:outline-none' value={usernameInput} onChange={(e: any) => setUsernameInput(e.target.value)} /> */}
                                    </div>

                                    <div className='w-full flex justify-end'>
                                        <button onClick={handleDialogClose}>
                                            <VscClose size={20} />
                                        </button>
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