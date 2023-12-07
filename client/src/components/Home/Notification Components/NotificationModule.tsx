/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconContext } from 'react-icons'
import { useTheme } from "../../Contexts";

const NotificationModule = ({ notification, height }: {
    notification: {
        icon: React.JSX.Element,
        iconBackgroundColor: string,
        title: string,
        description: string,
        actionIcon: React.JSX.Element,
    }, height: number
}) => {

    const { theme } = useTheme()

    return (
        <div className={`w-full h-full flex items-center`} style={{ height: height || 80 }} >

            <div className={`rounded-lg flex justify-center items-center p-2 m-3`} style={{ backgroundColor: notification.iconBackgroundColor }}  >
                <IconContext.Provider value={{ color: 'white', size: '30' }}>
                    {
                        notification.icon
                    }
                </IconContext.Provider>
            </div>

            <div className='flex flex-col flex-1'>
                <span className='text-sm'>
                    {notification.title}
                </span>
                <span className='font-semibold'>
                    {notification.description}
                </span>
            </div>

            <button className='mr-3'>
                <IconContext.Provider value={{ color: theme === 'dark' ? 'white' : 'black', size: '18' }}>
                    {notification.actionIcon}
                </IconContext.Provider>
            </button>

        </div>

    )
}

export default NotificationModule