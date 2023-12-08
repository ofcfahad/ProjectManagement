import React, { createContext, ReactNode, useState } from 'react';
import { User } from '../../Interfaces';
import Cookies from 'js-cookie';
import { useApi } from '..';

interface UserPreferences {
    theme: string;
    toolTipisVisible: boolean;
}

interface UserDataContextProps {
    getUserData: () => User;
    getUserDatafromDatabase: () => Promise<User>;
    getUserPreferences: () => UserPreferences;
    setUserPreferences: (preferences: UserPreferences) => void;
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

    const getUserPreferences = () => {
        return user.preferences;
    };

    const setUserPreferences = (preferences: UserPreferences) => {
        setUser({ ...user, preferences: preferences });
    }

    const reset = () => {
        setUser({} as User);
    };

    const contextValue: UserDataContextProps = {
        getUserData,
        getUserDatafromDatabase,
        getUserPreferences,
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
