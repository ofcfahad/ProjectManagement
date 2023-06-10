/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ThemeContext.js
import { createContext } from 'react';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {''} });

const ThemeContextProvider = ({ theme, toggleTheme, children }: { theme: string, toggleTheme: any, children: any }) => {
    return (
        <>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                {children}
            </ThemeContext.Provider>
        </>
    )
};

export default ThemeContextProvider;
