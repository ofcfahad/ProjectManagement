import { useEffect, useState, useCallback, useRef } from 'react';
import { useApi, useUserData } from '../Contexts';
import { Chat as ChatType, Message as MessageType } from '../Interfaces';
import Inputbar from './Inputbar';
import Message from './Message';
import Toolbar from './Toolbar';
import { getSocket } from './socket';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion'
import { Skeleton } from 'antd';

export default function Chat({ chat }: { chat: ChatType }) {

    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isActive, setIsActive] = useState(false);

    const { getUserData } = useUserData();
    const userData = getUserData();

    const { fetchChatMessages } = useApi()

    const socket = getSocket()

    const messagesRef = useRef<HTMLDivElement>(null);

    const recipient =
        chat.participants[0].userName == userData.userName
            ? chat.participants[1]
            : chat.participants[0];

    const onMessageRecieved = useCallback((message: MessageType) => {
        console.log(message);
        if (message.chat_id !== chat._id) return;
        setMessages((prevMessages) => [...prevMessages, message]);
    }, []
    );

    const checkforUserOnline = useCallback(() => {
        try {
            socket.emit('checkforUserOnline', { me: userData._id, user: recipient._id })
        } catch (error) {
            console.log(`from checkforUserOnline: ${error}`);
        }
    }, [])

    useEffect(() => {
        socket.emit('joinChat', chat._id);

        socket.on('chat message', onMessageRecieved);

        return () => {
            socket.off('chat message', onMessageRecieved);

            socket.emit('leaveChat', chat._id);
        };
    }, []);

    const getChatMessages = useCallback(async () => {
        const data = await fetchChatMessages(chat._id);
        setMessages(data);
    }, [chat._id, fetchChatMessages]);

    // const populateUserData = useCallback(
    //     (message: {
    //         chat_id: string;
    //         sender: string;
    //         content: { text: string };
    //         sent: Date;
    //     }) => {
    //         return {
    //             ...message,
    //             sender: { _id: userData._id, fullName: userData.fullName, userProfilePicture: userData.userProfilePicture, userEmail: userData.userEmail, userName: userData.userName, } as Person,
    //         };
    //     }, [userData]);

    const sendMessage = useCallback(
        (textContent: string) => {
            const message = {
                chat_id: chat._id,
                sender: userData._id,
                content: { text: textContent },
                sent: new Date(Date.now()),
            };

            //setMessages((prevMessages) => [...prevMessages, populateUserData(message)]);

            socket.emit('chat message', {
                recipient: recipient._id,
                message,
            });
        },
        [chat._id, userData._id, recipient._id]);

    useEffect(() => {
        getChatMessages();
        checkforUserOnline();
    }, [getChatMessages, checkforUserOnline]);

    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesRef.current) {
                messagesRef.current.scrollTo({
                    top: messagesRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        };

        scrollToBottom();
    }, [messages]);

    return (
        <div className={`w-full h-full font-oswald flex flex-col`}>

            {/* Messages */}
            <div className={`w-full h-[92%] flex flex-col-reverse overflow-scroll scroll-smooth`} ref={messagesRef}>
                {
                    messages.length > 0 ? messages.slice().reverse().map((message) => (
                        <Message key={message._id} message={message} />
                    ))
                        :
                        <div className="w-full p-2 flex flex-col gap-2">

                            <div className="px-4 flex justify-end gap-2">
                                <div className='w-40'>
                                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                                </div>
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-start gap-2">
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                                <div className='w-40'>
                                    <Skeleton.Input active={true} size={'small'} block />
                                </div>
                            </div>

                            <div className="px-4 flex justify-start gap-2">
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                                <div className='w-40'>
                                    <Skeleton.Image active={true} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-end gap-2">
                                <div className='w-40'>
                                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                                </div>
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-end gap-2">
                                <div className='w-40'>
                                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                                </div>
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-end gap-2">
                                <div className='w-40'>
                                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                                </div>
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-start gap-2">
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                                <div className='w-40'>
                                    <Skeleton.Input active={true} size={'small'} block />
                                </div>
                            </div>

                            <div className="px-4 flex justify-start gap-2">
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                                <div className='w-40'>
                                    <Skeleton.Image active={true} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-end gap-2">
                                <div className='w-40'>
                                    <Skeleton.Input active={true} size={'small'} block />
                                </div>
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-end gap-2">
                                <div className='w-40'>
                                    <Skeleton.Image active={true} />
                                </div>
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                            </div>

                            <div className="px-4 flex justify-start gap-2">
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                                <div className='w-40'>
                                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                                </div>
                            </div>

                            <div className="px-4 flex justify-end gap-2">
                                <div className='w-40'>
                                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                                </div>
                                <div className="flex items-end">
                                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                                </div>
                            </div>
                        </div>
                }
            </div>

            <motion.div className='w-40 h-7 fixed bg-red-600 rounded-full'>
                ..
            </motion.div>

            {/* Toolbar */}
            <Toolbar profile={recipient} active={isActive} />

            {/* Inputbar */}
            <Inputbar onMessageSend={sendMessage} />
        </div>
    )
}