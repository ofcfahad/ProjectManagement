import { ChangeEvent, Fragment, KeyboardEventHandler, useState } from 'react'
import { useUserData, useTheme } from '../Contexts'
import { themeColors } from '../utils'
import { BsSend } from "react-icons/bs";
import { GrEmoji } from "react-icons/gr";
import EmojiPicker from 'emoji-picker-react';
import { Popover, Transition } from '@headlessui/react';
import { profilePicture } from '../../assets';
import { getSocket } from './socket';

export default function Inputbar({ onMessageSend }: { onMessageSend: (textContent: string) => void }) {

    const [message, setMessage] = useState<string>('')

    const { getUserData } = useUserData()
    const userData = getUserData()

    const { theme } = useTheme()
    const bgColor = themeColors(theme, 'background')

    const socket = getSocket()

    const sendMessage = async () => {
        const _message = message.trim()
        if (!_message) return
        onMessageSend(_message)
        setMessage('')
    }

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            console.log('enter pressed');

            sendMessage()
        }
    }

    return (
        <div className={`h-[60px] w-[70%] rounded-full shadow-lg absolute bottom-5 left-[28%] ${bgColor} flex justify-between items-center gap-2 px-2`}>

            <div className='flex items-center w-full gap-2'>
                <img src={userData.userProfilePicture || profilePicture} width={40} className={`rounded-full ${socket.connected && 'border-2 border-green-500 p-0.5'}`} />

                <input type="text" placeholder='Type a message' className='bg-transparent w-full h-full font-ubuntu text-xl focus:outline-none' onKeyDown={onKeyDown} value={message} onChange={(event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value)} />
            </div>

            <div className='flex gap-2'>

                <Popover className="relative">
                    {({ open }) => (
                        <div>
                            <Popover.Button
                                className={`
                ${open ? 'text-white' : 'text-white/90'}
                group inline-flex items-center rounded-full w-10 h-10 justify-center text-base font-medium hover:bg-[#f5f5f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                            >
                                <GrEmoji className='w-6 h-6 text-black' />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute right-0 bottom-10">
                                    <EmojiPicker />
                                </Popover.Panel>
                            </Transition>
                        </div>
                    )}
                </Popover>

                <button className='pt-0.5 px-2 flex justify-center bg-[#734ae3] items-center rounded-full hover:bg-opacity-90' onClick={sendMessage}>
                    <BsSend className='w-6 h-6 text-white' />
                </button>

            </div>

        </div>
    )
}
