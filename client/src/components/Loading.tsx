import { useContext } from 'react'
import { motion } from 'framer-motion'
import UseAnimations from 'react-useanimations'
import loading2 from 'react-useanimations/lib/loading2'
import { ThemeContext } from './Contexts/Theme/ThemeContext'


const Loading = ({ haveBackgroundColor, backgroundColor }: { haveBackgroundColor: boolean, backgroundColor: string }) => {

    const { theme } = useContext(ThemeContext)

    return (
        <>
            <motion.div className={`h-full w-full ${haveBackgroundColor ? backgroundColor || 'bg-sidebarcolor' : 'bg-transparent'} select-none `} exit={{
                width: 100
            }
            }>
                <motion.div className='flex justify-center items-center h-full w-full' >
                    <UseAnimations animation={loading2} size={40} fillColor={theme === 'dark' ? 'white' : 'black'} />
                </motion.div>

            </motion.div >
        </>
    )
}

export default Loading