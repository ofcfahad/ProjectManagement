import UseAnimations from 'react-useanimations'
import menu4 from 'react-useanimations/lib/menu4'
import { useTheme, useSidebar } from './Contexts'
import { themeColors } from './utils'

export default function MenuButton() {

    const { theme } = useTheme()
    const { expand, toggleExpand } = useSidebar()
    const color = themeColors(theme, 'main')

    return (
        <UseAnimations animation={menu4} size={25} reverse={expand} onClick={toggleExpand} strokeColor={color} className='cursor-pointer' />
    )
}
