import React, { createContext, ReactNode, useState } from 'react';

interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;
    setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeValue, setThemeValue] = useState('light')

    const handleThemeChange = () => {
        if (themeValue === 'dark') {
            setThemeValue('light')
        } else {
            setThemeValue('dark')
        }
    }

    const setTheme = (theme: string) => {
        setThemeValue(theme)
    }

    const contextValue: ThemeContextProps = {
        theme: themeValue,
        toggleTheme: handleThemeChange,
        setTheme: setTheme
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
