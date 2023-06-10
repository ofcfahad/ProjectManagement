/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export const NavbarContext = createContext({ expand: false, toggleExpand: () => { '' } });

const NavbarContextProvider = ({ expand, toggleExpand, children }: { expand: boolean, toggleExpand: any, children: any }) => {
    return (
        <>
            <NavbarContext.Provider value={{ expand, toggleExpand }}>
                {children}
            </NavbarContext.Provider>
        </>
    )
};

export default NavbarContextProvider;