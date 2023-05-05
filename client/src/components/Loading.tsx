import React from 'react'
import { motion } from 'framer-motion'
import UseAnimations from 'react-useanimations'
import loading2 from 'react-useanimations/lib/loading2'


const Loading = ({ loading, haveBackgroundColor, backgroundColor }) => {

    return (
        <>
            <motion.div className={`h-full w-full ${haveBackgroundColor ? backgroundColor || 'bg-sidebarcolor' : 'bg-transparent'} select-none `} exit={{
                width: 100
            }
            }>
                <motion.div className='flex justify-center items-center h-full w-full' >
                    <UseAnimations animation={loading2} size={40} />
                </motion.div>

            </motion.div >
        </>
    )
}

export default Loading