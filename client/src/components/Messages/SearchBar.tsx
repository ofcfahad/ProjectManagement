import { motion } from 'framer-motion'
import { ChangeEvent, createRef, useState } from 'react'
import { IconContext } from 'react-icons'
import { CiSearch } from 'react-icons/ci'
import { IoIosCloseCircle } from "react-icons/io";

export default function SearchBar() {

    const [searchContent, setsearchContent] = useState<string>()

    const inputRef = createRef<HTMLInputElement>()

    const handleCrossClick = () => { setsearchContent('') }

    return (
        <div className={`w-full h-full flex rounded bg-[#f5f5f5] border items-center px-2`}>

            {/* ICON */}
            <div className='h-full flex justify-center items-center'>
                <IconContext.Provider value={{ size: '22' }}>
                    <CiSearch />
                </IconContext.Provider>
            </div>

            {/* INPUT */}
            <input type="text" ref={inputRef} placeholder='Search' value={searchContent} className={`px-2 font-ubuntu focus:outline-none bg-transparent h-full w-full flex items-center text-gray-600 `} onChange={(event: ChangeEvent<HTMLInputElement>) => setsearchContent(event.target.value)} />

            {/* CROSS ICON */}
            <div className='rounded-r-full h-full px-2'>
                {
                    searchContent &&
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='h-full w-full' style={{ color: 'gray' }} onClick={handleCrossClick}>
                        <IconContext.Provider value={{ size: '20' }}>
                            <IoIosCloseCircle />
                        </IconContext.Provider>
                    </motion.button>
                }
            </div>

        </div>
    )
}
