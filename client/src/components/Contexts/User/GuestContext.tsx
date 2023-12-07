import React, { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../../Interfaces';

interface GuestContextProps {
    isGuest: boolean;
    guestData: User;
    setIsGuest: (value: boolean) => void;
}

export const GuestContext = createContext<GuestContextProps | undefined>(undefined);

const GuestContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userIsGuest, setUserIsGuest] = useState(false);
    const guestUserData = {
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

    const setIsGuestFunc = async (value: boolean) => {
        setUserIsGuest(value);
    };

    const contextValue: GuestContextProps = {
        isGuest: userIsGuest,
        guestData: guestUserData,
        setIsGuest: setIsGuestFunc
    };

    return (
        <GuestContext.Provider value={contextValue}>
            {children}
        </GuestContext.Provider>
    );
};

export default GuestContextProvider;


export const useGuestContext = () => {
    const context = useContext(GuestContext);
    if (!context) {
        throw new Error('useGuestContext must be used within a GuestContextProvider');
    }
    return context;
};