/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'
import { User } from '../interfaces';

export const UserDataContext = createContext({
    userName: '',
    fullName: '',
    userEmail: '',
    userGithubLink: '',
    userProfilePicture: '',
} as User);

const UserDataContextProvider = ({ userData, children }: { userData: User, children: any }) => {
    return (
        <>
            <UserDataContext.Provider value={userData}>
                {children}
            </UserDataContext.Provider>
        </>
    )
}

export default UserDataContextProvider