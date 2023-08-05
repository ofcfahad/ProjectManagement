/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'
import { CiSearch } from 'react-icons/ci'
import { RxCross1 } from 'react-icons/rx'
import Cookies from 'js-cookie'
import { ThemeContext, UserDataContext, UserSettingsContext } from '../../Contexts'
import { fetchSearchedProjectsData } from '../functions'
import { themeColors } from '../../functions'
import { IconContext } from 'react-icons'

const SearchBar = ({ searchContent, setsearchContent, setFetchingData, setLoadNewData, setNoSearchedProjects, setSearchedProjectsData }: { searchContent: string, setsearchContent: any, setFetchingData: any, setLoadNewData: any, setNoSearchedProjects: any, setSearchedProjectsData: any }) => {

    const [isExpanded, setisExpanded] = useState(false)
    const [isFocused, setisFocused] = useState(false)

    const { toolTipisVisible } = useContext(UserSettingsContext)
    const userData = useContext(UserDataContext)
    const { theme } = useContext(ThemeContext)
    const bgColor = themeColors(theme, 'background')
    const color = themeColors(theme, 'main')

    const SearchBar = document.getElementById('search_query')
    const handleSearchIconClick = () => { isFocused && searchContent ? fetchSearchedProjectsData(setFetchingData, setLoadNewData, setNoSearchedProjects, setSearchedProjectsData, userData._id, Cookies.get('session')!, searchContent) : isFocused ? SearchBar?.focus() : null }
    const handleCrossClick = () => { setsearchContent(''), setisExpanded(false), setSearchedProjectsData([]), setNoSearchedProjects(false) }

    const onFocus = () => {
        setisFocused(true);
        setisExpanded(true);
    }
    const onBlur = () => {
        if (!searchContent) {
            setisFocused(false);
            setisExpanded(false);
        }
    };

    return (
        <motion.div initial={{ width: 200 }} animate={{ width: isExpanded ? 500 : 200 }} transition={{ duration: 0.5 }} className='ml-5 h-[70%] flex items-center bg-transparent select-none'>
            <div className={`w-full h-full flex rounded-full ${bgColor} items-center px-1`} onFocus={onFocus} onBlur={onBlur} >
                {/* ICON */}
                <button onClick={handleSearchIconClick} className='h-full rounded-l-full px-1' data-tooltip-id='searchIconToolTip' >
                    <CiSearch />
                </button>
                {
                    toolTipisVisible &&
                    <Tooltip id='searchIconToolTip' delayShow={100} delayHide={0} place='top'>
                        Search
                    </Tooltip>
                }
                {/* INPUT */}
                <input type="span" placeholder='Search' id='search_query' value={searchContent} className={`px-1 py-1 focus:outline-none bg-transparent h-full w-full flex items-center text-${color} `} onChange={(event: any) => setsearchContent(event.target.value)} />
                <div className='rounded-r-full h-full px-2'>
                    {
                        searchContent &&
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='h-full w-full' style={{ color: color }} onClick={handleCrossClick}>
                            <IconContext.Provider value={{ size: '18' }}>
                                <RxCross1 />
                            </IconContext.Provider>
                        </motion.button>
                    }
                </div>

            </div>
        </motion.div>
    )
}

export default SearchBar