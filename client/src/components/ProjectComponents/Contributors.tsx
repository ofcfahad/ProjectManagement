/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Popover } from 'antd'
import { profilePicture } from '../../assets'


export default function Contributors({ contributorsData, linkDisabled, avatarSize, avatarShape, bordered, borderColor, borderSize, alignover, toLeft, toTop, onHoverMargin, row }: { contributorsData: any, linkDisabled: boolean, avatarSize: number, avatarShape: string, bordered: boolean, borderColor: string, borderSize: number, alignover: boolean, toLeft: number, toTop: number, onHoverMargin: number, row: boolean }) {

    const [isHovering, setisHovering] = useState(false)

    const contributors = contributorsData.map((contributor: { _id: any; id: any; userName: any; name: any; userProfilePicture: any; avatar: any; userGithubLink: any; profilelink: any }) => ({
        id: contributor._id || contributor.id,
        name: contributor.userName || contributor.name,
        avatar: contributor.userProfilePicture || contributor.avatar || profilePicture,
        profilelink: contributor.userGithubLink || contributor.profilelink,
    }))

    return (
        <motion.div initial={{ x: -50 }} animate={{ x: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: row ? 'row' : 'column', alignContent: 'center', height: avatarSize || 50, }} onMouseOver={() => setisHovering(linkDisabled ? false : true)} onMouseOut={() => setisHovering(false)} >
            {
                contributors.map((contributor: { id: any | null | undefined; name: any; avatar: any; profilelink: any }) => (
                    <Contributor key={contributor.id} name={contributor.name} avatar={contributor.avatar} profilelink={contributor.profilelink} linkDisabled={linkDisabled} isHovering={isHovering} alignover={alignover} toLeft={toLeft} toTop={toTop} avatarSize={avatarSize} avatarShape={avatarShape} bordered={bordered} borderColor={borderColor} borderSize={borderSize} row={row} onHoverMargin={onHoverMargin} />
                ))
            }
        </motion.div>
    )
}


const Contributor = ({ profilelink, name, avatar, linkDisabled, isHovering, row, alignover, toLeft, toTop, onHoverMargin, avatarSize, avatarShape, bordered, borderColor, borderSize }: { profilelink: string, name: string, avatar: string, linkDisabled: boolean, isHovering: boolean, row: boolean, alignover: boolean, toLeft: number, toTop: number, onHoverMargin: number, avatarSize: number, avatarShape: string, bordered: boolean, borderColor: string, borderSize: number }) => {
    return (
        <motion.div animate={{ marginRight: alignover && row && !isHovering ? -toLeft || -25 : onHoverMargin ? -onHoverMargin : 0, marginBottom: isHovering ? 5 : 0, marginTop: !row && !isHovering ? -toTop || -25 : 0 }} className={` bg-transparent flex justify-center items-center`} style={{ height: avatarSize || 50, width: avatarSize || 50, borderRadius: avatarShape === 'rounded-square' ? 10 : avatarShape === 'rounded-circle' ? 100 : 0, }} >
            <a href={profilelink} className=' w-full h-full flex rounded-full justify-center items-center ' style={{ pointerEvents: linkDisabled ? 'none' : undefined }} >
                <Popover content={name} trigger={'hover'} mouseEnterDelay={0} mouseLeaveDelay={0} >
                    <motion.img whileHover={{ height: '100%', width: '100%' }} transition={{ duration: 0.1 }} src={avatar} style={{ height: '80%', width: '80%', userSelect: 'none', border: bordered ? 'solid' : 'none', borderWidth: bordered ? borderSize || 1 : 0, borderColor: bordered ? borderColor || 'black' : 'none', borderRadius: avatarShape === 'rounded-square' ? 10 : avatarShape === 'rounded-circle' ? 100 : 0, }} />
                </Popover>
            </a>
        </motion.div>
    )
}