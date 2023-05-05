import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Popover } from 'antd'


export default function Contributors({ contributorsData , name, profilelink, linkDisabled, avatar, avatarSize, avatarShape, bordered, borderColor, borderSize, alignover, toLeft, toTop, onHoverMargin, row, customTailwindforParentDiv, customTailwindforAvatar }) {

    const [isHovering, setisHovering] = useState(false)


    const contributors = contributorsData ? contributorsData.map(contributor => ({
        name: contributor.userName || contributor.name || name,
        avatar: contributor.userProfilePicture || contributor.avatar || avatar,
        profilelink: contributor.userGithubLink || contributor.profilelink || profilelink,
    })) : [
        {
            name,
            avatar,
            profilelink,
        }
    ]

    return (
        <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }} className={` ${customTailwindforParentDiv} `} style={{ display: 'flex', flexDirection: row ? 'row' : 'column', alignContent: 'center', height: avatarSize || 50, }} onMouseOver={() => setisHovering(linkDisabled ? false : true)} onMouseOut={() => setisHovering(false)} >
            {
                contributors.map(contributor => (
                    <Contributor key={contributor.name} contributor={contributor} linkDisabled={linkDisabled} isHovering={isHovering} alignover={alignover} toLeft={toLeft} toTop={toTop} avatarSize={avatarSize} avatarShape={avatarShape} bordered={bordered} borderColor={borderColor} borderSize={borderSize} row={row} onHoverMargin={onHoverMargin} customTailwindforfirstDiv={undefined} marginRight={undefined} />
                ))
            }
        </motion.div>
    )
}


const Contributor = ({ contributor, linkDisabled, marginRight, isHovering, row, alignover, toLeft, toTop, onHoverMargin, avatarSize, avatarShape, bordered, borderColor, borderSize, customTailwindforfirstDiv }) => {
    return (
        <motion.div animate={{ marginRight: alignover && row && !isHovering ? -toLeft || -25 : onHoverMargin ? -onHoverMargin : 0, marginBottom: isHovering ? 5 : 0, marginTop: !row && !isHovering ? -toTop || -25 : 0 }} className={` bg-transparent ${customTailwindforfirstDiv} flex justify-center items-center`} style={{ height: avatarSize || 50, width: avatarSize || 50, borderRadius: avatarShape === 'rounded-square' ? 10 : avatarShape === 'rounded-circle' ? 100 : 0, }} >
            <a href={contributor.profilelink} className=' w-full h-full flex rounded-full justify-center items-center ' style={{ pointerEvents: linkDisabled ? 'none' : undefined }} >
                <Popover content={contributor.name} trigger={'hover'} mouseEnterDelay={0} mouseLeaveDelay={0} >
                    <motion.img whileHover={{ height: '100%', width: '100%' }} transition={{ duration: 0.1 }} src={contributor.avatar} style={{ height: '80%', width: '80%', userSelect: 'none', border: bordered ? 'solid' : 'none', borderWidth: bordered ? borderSize || 1 : 0, borderColor: bordered ? borderColor || 'black' : 'none', borderRadius: avatarShape === 'rounded-square' ? 10 : avatarShape === 'rounded-circle' ? 100 : 0, }} />
                </Popover>
            </a>
        </motion.div>
    )
}