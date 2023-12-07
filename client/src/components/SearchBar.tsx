/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RxCross1 } from 'react-icons/rx'
import { CiSearch } from 'react-icons/ci'
import { IconContext } from 'react-icons'
import { themeColors } from './utils'
import { useTheme } from './Contexts'

const SearchBar = ({ searchContent, setsearchContent, onSearchIconClick, onCrossIconClick }: { searchContent: string, setsearchContent: (content: string) => void, onSearchIconClick: () => void, onCrossIconClick: () => void }) => {

    const [isFocused, setisFocused] = useState(false)

    const { theme } = useTheme()
    const bgColor = themeColors(theme, 'background')
    const color = themeColors(theme, 'main')

    const inputRef = createRef<HTMLInputElement>();

    const handleSearchIconClick = () => { isFocused && searchContent ? onSearchIconClick() : isFocused ? inputRef!.current?.focus() : null }
    const handleCrossIconClick = () => {
        setsearchContent('')
        setisFocused(false)

        onCrossIconClick()
    }

    const onFocus = () => {
        setisFocused(true);
    }

    const onBlur = () => {
        if (!searchContent) {
            setisFocused(false);
        }
    };

    return (
        <motion.div initial={{ width: 200 }} animate={{ width: isFocused ? 500 : 200 }} transition={{ duration: 0.5 }} onFocus={onFocus} onBlur={onBlur} className={`h-full w-full flex rounded-full ${bgColor} items-center px-2 flex rounded-full select-none`}>

            {/* ICON */}
            <button onClick={handleSearchIconClick} className='h-full rounded-l-full'>
                <IconContext.Provider value={{ size: '24', color: color }}>
                    <CiSearch />
                </IconContext.Provider>
            </button>

            {/* INPUT */}
            <input type="text" ref={inputRef} placeholder='Search' value={searchContent} className={`px-2 font-ubuntu focus:outline-none bg-red-500 h-full w-full flex items-center text-${color}`} onChange={(event: any) => setsearchContent(event.target.value)} />

            {/* ClearIcon */}
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: searchContent ? 1 : 0 }} exit={{ opacity: 0 }} className={`rounded-full p-1 flex justify-end items-center hover:bg-white/10`} style={{ color: color }} onClick={handleCrossIconClick}>
                <IconContext.Provider value={{ size: '15' }}>
                    <RxCross1 />
                </IconContext.Provider>
            </motion.button>

        </motion.div>
    )
}

export default SearchBar