import React, { createContext, ReactNode, useState } from 'react';

interface SidebarContextProps {
    expand: boolean;
    toggleExpand: () => void;
}

export const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

const SidebarContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expanded, setExpanded] = useState(false)

    const handleSidebarExpansion = () => {
        setExpanded(!expanded)
    }

    const contextValue: SidebarContextProps = {
        expand: expanded,
        toggleExpand: handleSidebarExpansion
    };

    return (
        <SidebarContext.Provider value={contextValue}>
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarContextProvider;
