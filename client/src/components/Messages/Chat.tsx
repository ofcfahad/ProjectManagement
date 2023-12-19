import { useEffect, useState, useCallback, useRef, UIEventHandler } from 'react';
import { useApi, useUserData } from '../Contexts';
import { Chat as ChatType, Message as MessageType } from '../Interfaces';
import Inputbar from './Inputbar';
import Message from './Message';
import Toolbar from './Toolbar';
import SkeletonChat from './SkeletonChat'
import { getSocket } from './socket';
import { motion } from 'framer-motion'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

export default function Chat({ chat }: { chat: ChatType }) {

    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    const onScroll: UIEventHandler<HTMLDivElement> = (event) => {
        const element = event.target as HTMLDivElement;
        if (element.scrollTop < -500) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    }

    const scrollToTop = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTo({
                top: -messagesRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={`w-full h-full font-oswald flex flex-col`}>

            {/* Messages */}
            <div className={`w-full h-[92%] flex flex-col-reverse overflow-scroll scroll-smooth`} ref={messagesRef} onScroll={onScroll}>
                {
                    messages.length > 0 ? messages.slice().reverse().map((message) => (
                        <Message key={message._id} message={message} />
                    ))
                        :
                        <SkeletonChat />
                }
            </div>

            <motion.div animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : 100 }} transition={{ duration: 0.5 }} className='gap-2 fixed bottom-28 flex flex-col self-center rounded-full text-black text-sm font-ubuntu'>
                <button className='gap-2 p-2 flex justify-between bg-white/20 backdrop-blur-md rounded-full shadow-xl' disabled={!isScrolled} onClick={scrollToTop}>
                    Scroll to Top
                    <ArrowUpIcon className='w-5 self-center' />
                </button>

                <button className='gap-2 p-2 flex justify-between bg-white/20 backdrop-blur-md rounded-full shadow-xl' disabled={!isScrolled} onClick={scrollToBottom}>
                    Scroll to Recent
                    <ArrowDownIcon className='w-5 self-center' />
                </button>
            </motion.div>

            {/* Toolbar */}
            <Toolbar profile={recipient} active={isActive} />

            {/* Inputbar */}
            <Inputbar onMessageSend={sendMessage} />
        </div>
    )
}