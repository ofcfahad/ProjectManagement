/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ThemeContext.js
import { createContext } from 'react';

export const UserSettingsContext = createContext({
    theme: 'light',
    toolTipisVisible: false
});

const UserSettingsContextProvider = ({ theme, toolTipisVisible, children }: { theme: string, toolTipisVisible: boolean, children: any }) => {
    return (
        <>
            <UserSettingsContext.Provider value={{ theme, toolTipisVisible }}>
                {children}
            </UserSettingsContext.Provider>
        </>
    )
};

export default UserSettingsContextProvider;
