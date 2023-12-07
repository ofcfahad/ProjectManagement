import React, { createContext, ReactNode, useState } from 'react';
import { User } from '../../Interfaces';
import Cookies from 'js-cookie';
import { useApi } from '..';

interface UserDataContextProps {
    getUserData: () => User;
    getUserDatafromDatabase: () => Promise<User>;
    setUserPreferences: (preferences: { theme: string, toolTipisVisible: boolean }) => void;
    reset: () => void;
}

export const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);

const guestUserData: User = {
    _id: 'guestedId',
    userName: 'guest',
    fullName: 'Guest',
    userEmail: 'guest@pjm.app',
    userProfilePicture: '',
    userGithubLink: '',
    preferences: {
        theme: 'light',
        toolTipisVisible: false
    }
}

const UserDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({} as User);

    const { fetchUserData } = useApi()

    const getUserData = () => {
        return user;
    };

    const getUserDatafromDatabase = async () => {
        if (Cookies.get('session') === 'loggedinasguestuser') {
            return guestUserData
        }
        const data = await fetchUserData()
        setUser(data);
        return data;
    };

    const setUserPreferences = (preferences: { theme: string, toolTipisVisible: boolean }) => {
        user.preferences = preferences;
    }

    const reset = () => {
        setUser({} as User);
    };

    const contextValue: UserDataContextProps = {
        getUserData,
        getUserDatafromDatabase,
        setUserPreferences,
        reset,
    };

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserDataContextProvider;
