import React, { createContext, ReactNode, useState } from 'react';
import { User } from '../../interfaces';

interface UserDataContextProps {
    userData: User;
    setUserData: (user: User) => void;
    setUserPreferences: (preferences: { theme: string, toolTipisVisible: boolean }) => void;
}

export const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);

const UserDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({
        _id: undefined,
        userName: '',
        fullName: '',
        userEmail: '',
        userProfilePicture: '',
        userGithubLink: '',
        preferences: {
          theme: '',
          toolTipisVisible: false
        }
      });

    const setUserDataFunc = async (myuser: User) => {
        setUser(myuser)
    };

    const setUserPreferencesFunc = (preferences: { theme: string, toolTipisVisible: boolean }) => {
        user.preferences = preferences;
    }

    const contextValue: UserDataContextProps = {
        userData: user,
        setUserData: setUserDataFunc,
        setUserPreferences: setUserPreferencesFunc
    };

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserDataContextProvider;
