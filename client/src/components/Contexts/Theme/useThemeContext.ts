import { useContext } from 'react';
import { ThemeContext } from './ThemeContext'

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
};

export default useTheme