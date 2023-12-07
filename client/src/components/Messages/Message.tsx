import { useUserData } from "../Contexts";
import { Message as MessageType } from "../Interfaces";
import { profilePicture } from '../../assets';

export default function Message({ message }: { message: MessageType }) {

    const { sender, content, sent } = message;

    const { getUserData } = useUserData()
    const userData = getUserData()

    const date = new Date(sent).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })

    return (
        <div className="w-full p-2 flex flex-col gap-2">
            {
                sender.userName === userData.userName ?
                    <SentMessage />
                    :
                    <RecievedMessage />
            }
        </div>
    )

    function SentMessage() {
        return (
            <div className="px-4 flex justify-end gap-2">
                <div className="bg-white p-2 rounded-xl flex flex-col">
                    {content.text}
                    <span className="text-[8px] text-gray-500">
                        {date}
                    </span>
                </div>
                <div className="flex items-end min-w-[30px]">
                    <img src={userData.userProfilePicture || profilePicture} alt="" width={30} className="rounded-full" />
                </div>
            </div>
        )
    }

    function RecievedMessage() {
        return (
            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end min-w-[30px]">
                    <img src={userData.userProfilePicture || profilePicture} alt="" width={30} className="rounded-full" />
                </div>
                <div className="bg-cyan-300 p-2 rounded-xl flex flex-col max-w-1/2">
                    <span className="">
                        {content.text}
                    </span>
                    <span className="text-[8px] text-gray-500">
                        {date}
                    </span>
                </div>
            </div>
        )
    }

}