import React, { createContext, ReactNode, useState } from 'react';
import { Chat } from '../../Interfaces';
import { useApi } from '..';

interface ChatsContextProps {
    addChat: (chat: Chat) => void;
    deleteChat: (chatId: string) => void;
    getChats: () => Chat[];
    fetchChatsDatafromDatabase: () => Promise<void>;
    reset: () => void
}

export const ChatsContext = createContext<ChatsContextProps | undefined>(undefined);

const ChatsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chats, setChats] = useState<Array<Chat>>([]);

    const { fetchUserChats } = useApi();

    const addChat = (chat: Chat) => {
        setChats([...chats, chat])
    };

    const deleteChat = (chatId: string) => {
        const filteredChats = chats.filter((chat) => {
            return chat._id !== chatId;
        });
        setChats(filteredChats);
    };

    const getChats = () => {
        return chats;
    };

    const fetchChatsDatafromDatabase = async () => {
        await fetchUserChats()
            .then((data) => {
                setChats(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const reset = () => {
        setChats([])
    }

    const contextValue: ChatsContextProps = {
        getChats,
        fetchChatsDatafromDatabase,
        addChat,
        deleteChat,
        reset
    };

    return (
        <ChatsContext.Provider value={contextValue}>
            {children}
        </ChatsContext.Provider>
    );
};

export default ChatsContextProvider;
