import React, { ReactNode, createContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Chat, Message, Project, User } from '../../Interfaces';

interface ApiFunctions {
    forgotPassword: (userEmail: string) => Promise<boolean>;
    resetPassword: (userPassword: string, token: string) => Promise<boolean>;
    sendOTP: (userEmail: string) => Promise<boolean>;
    verifyOTP: (userEmail: string, userPassword: string, otp: string) => Promise<boolean>;

    registerUser: (userName: string, userPassword: string) => Promise<{ message: string, token?: string }>;
    continueUnVerifiedUser: (userEmail: string, userPassword: string) => Promise<boolean>;
    updateEmail: (userName: string, userPassword: string, userEmail: string) => Promise<boolean>;
    authenticateUser: (userName: string, userPassword: string) => Promise<{ message: string, mfa?: boolean, email?: string, token?: string }>;
    fetchUserData: () => Promise<User>;

    fetchUserChats: () => Promise<Chat[]>;
    createChat: (participants: string[]) => Promise<Chat>;
    fetchChatMessages: (chatId: string) => Promise<Message[]>;

    fetchProjectsData: () => Promise<Project[]>;
    searchProjects: (query: string) => Promise<Project[]>;
    deleteProject: (projectId: string) => Promise<boolean>;

    logoutUser: () => Promise<boolean>;
}

export const ApiContext = createContext<ApiFunctions | undefined>(undefined);

const ApiContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const forgotPassword = async (userEmail: string) => {
        try {
            const response = await axios.post('/server/api/forgotPassword', { userEmail })
            if (response.status === 200) {
                return true
            }
            return false
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:73 ~ forgotPassword ~ error:", error)
            return false
        }
    }

    const resetPassword = async (userPassword: string, token: string) => {
        try {
            const response = await axios.post('/server/api/resetPassword', { userPassword, token })
            if (response.status === 200) {
                return true
            }
            return false
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:73 ~ forgotPassword ~ error:", error)
            return false
        }
    }

    const sendOTP = async (userEmail: string) => {
        try {
            const response = await axios.post(`/server/api/sendOTP`, { userEmail: userEmail })
            const status = response.status
            if (status != 200) {
                console.log('error');
            }
            return true
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:71 ~ sendOTP ~ error:", error)
            return false
        }
    }

    const verifyOTP = async (userEmail: string, userPassword: string, otp: string) => {
        try {
            const response = await axios.post(`/server/api/verifyOTP`, { userEmail: userEmail, userPassword: userPassword, otp: otp })
            if (response.status === 200) {
                const token = response.data.token
                Cookies.set('session', token, { expires: 7 })
                return true
            }
            return false
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:86 ~ verifyOTP ~ error:", error)
            return false
        }
    }

    const registerUser = async (userName: string, userPassword: string) => {
        try {
            const response = await axios.post(`/server/api/register`, {
                user: {
                    userName,
                    userPassword,
                }
            })

            return response.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                return { message: 'conflict' };
            } else {
                console.log("🚀 ~ file: APIContext.tsx:106 ~ registerUser ~ error:", error)
                return { message: 'Something went wrong' }
            }
        }
    }

    const authenticateUser = async (userName: string, userPassword: string) => {
        try {
            const apiResponse = await axios.post(`/server/api/authenticateUser`, { userName, userPassword });

            return apiResponse.data
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:122 ~ authenticateUser ~ error:", error)
            return { message: 'Error', email: '' };
        }
    };

    const continueUnVerifiedUser = async (userName: string, userPassword: string) => {
        try {
            const response = await axios.put(`/server/api/notVerified`, { userName, userPassword })
            const token = response.data.token
            Cookies.set('session', token, { expires: 7 })
            return true
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:123 ~ continueUnVerifiedUser ~ error:", error)
            return false
        }
    }

    const updateEmail = async (userName: string, userPassword: string, userEmail: string) => {
        try {
            const response = await axios.put(`/server/api/updateEmail`, { userName, userPassword, userEmail })
            const token = response.data.token
            Cookies.set('session', token, { expires: 7 })
            return true
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:135 ~ updateEmail ~ error:", error)
            return false
        }
    }

    const fetchUserData = async () => {
        try {
            const session = Cookies.get('session')

            const response = await axios.get(`/server/api/getUserData`, { headers: { Authorization: session } })

            if (!response) {
                throw new Error('Network response was not ok');
            }

            const data = response.data
            return data
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:139 ~ fetchUserData ~ error:", error)
        }
    };

    const fetchUserChats = async () => {
        try {
            const session = Cookies.get('session')
            const response = await axios.get(`/server/api/getUserChats`, { headers: { Authorization: session } })

            if (!response) {
                throw new Error('Network response was not ok')
            }

            const data = await response.data
            return data
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:155 ~ fetchUserChats ~ error:", error)
            return []
        }
    }

    const createChat = async (participants: string[]) => {
        try {
            const session = Cookies.get('session')
            const response = await axios.post(`/server/api/createNewChat`, { recipient: participants[0] }, { headers: { Authorization: session } })

            if (!response) {
                throw new Error('Network response was not ok')
            }

            const data = await response.data
            return data
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:172 ~ createChat ~ error:", error)
            return {}
        }
    }

    const fetchChatMessages = async (chatId: string) => {
        try {
            const session = Cookies.get('session')
            const response = await axios.post(`/server/api/getChatMessages`, { chatId }, { headers: { Authorization: session } });

            if (!response) {
                throw new Error('Network response was not ok');
            }

            const data = await response.data;
            return data
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:189 ~ fetchChatMessages ~ error:", error)
            return [];
        }
    }

    const fetchProjectsData = async () => {
        try {
            const session = Cookies.get('session')
            const response = await axios.get(`/server/api/projectsData`, { headers: { Authorization: session } })

            if (!response) {
                throw new Error('Network response was not ok');
            }

            const data = await response.data
            return data
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:206 ~ fetchProjectsData ~ error:", error)
            return []
        }
    };

    const searchProjects = async (query: string) => {
        try {
            const session = Cookies.get('session')
            const response = await axios.post(`/server/api/searchedProjectsData`, { searchQuery: query }, { headers: { Authorization: session } })

            if (!response) {
                throw new Error('Network response was not ok');
            }

            const data = await response.data
            return data
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:224 ~ searchProjects ~ error:", error)
            return []
        }
    }

    const deleteProject = async (projectId: string) => {
        try {
            const session = Cookies.get('session')
            const response = await axios.post(`/server/api/deleteProject`, { projectId }, {
                headers: {
                    Authorization: session
                }
            });
            if (!response) {
                throw new Error('Network response was not ok');
            }
            return true
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:242 ~ deleteProject ~ error:", error)
            return false
        }
    }

    const logoutUser = async () => {
        try {
            const sessionToken = Cookies.get('session')
            if (sessionToken == 'loggedinasguestuser') {
                return true;
            }
            const response = await axios.get(`/server/api/logout`, { headers: { Authorization: sessionToken } })
            if (response.status != 200) {
                return false
            } else {
                return true
            }
        } catch (error) {
            console.log("🚀 ~ file: APIContext.tsx:44 ~ logoutUser ~ error:", error)
            return false
        }
    }

    const contextValue: ApiFunctions = {
        forgotPassword,
        resetPassword,
        sendOTP,
        verifyOTP,

        registerUser,
        authenticateUser,
        continueUnVerifiedUser,

        fetchUserData,
        updateEmail,

        fetchUserChats,
        createChat,
        fetchChatMessages,

        fetchProjectsData,
        searchProjects,
        deleteProject,

        logoutUser,
    };

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
};

export default ApiContextProvider;