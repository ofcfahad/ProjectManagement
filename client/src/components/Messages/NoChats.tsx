import { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IconContext } from "react-icons";
import { nodata } from "../../assets";
import { useTheme } from '../Contexts';
import { themeColors } from '../utils';


export default function NoChats() {

    const [currentIndex, setCurrentIndex] = useState(0);

    const didYouKnow = [
        'Ensure your messages are encrypted to protect privacy. End-to-end encryption ensures only the sender and receiver can read the messages, adding a layer of security',
        'Text lacks tone and body language. Emojis, punctuation, and phrasing help convey emotions and prevent misunderstandings',
        `Respect time zones and the recipient's availability. Avoid bombarding someone with messages when they might be busy or sleeping`,
        'Avoid clicking on suspicious links or sharing sensitive information through messaging platforms to prevent phishing attacks or data breaches',
        'Respond in a timely manner, use proper grammar, and respect boundaries to maintain healthy communication'
    ];

    const { theme } = useTheme()
    const color = themeColors(theme, 'main')

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIndex < didYouKnow.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setCurrentIndex(0); // Loop back to the beginning
            }
        }, 10000); // Change string every 2 seconds (2000 milliseconds)

        return () => clearTimeout(timer);
    }, [currentIndex]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <img src={nodata} alt="nodata-illustration" width={600} />
            <span className={`text-${color} text-lg font-bold`}>Did You Know</span>
            <span className={`text-${color} text-center w-1/2 text-md font-oswald`}>{didYouKnow[currentIndex]}</span>
            <div className="flex gap-2">
                <button className="w-[30px] h-[30px] rounded flex justify-center items-center hover:bg-white/30" onClick={() => {
                    if (currentIndex > 0) {
                        setCurrentIndex(currentIndex - 1);
                    } else {
                        setCurrentIndex(didYouKnow.length - 1); // Loop back to the end
                    }
                }}>
                    <IconContext.Provider value={{ color: color, size: '20' }}>
                        <MdOutlineKeyboardArrowLeft />
                    </IconContext.Provider>
                </button>

                <button className="w-[30px] h-[30px] rounded flex justify-center items-center hover:bg-white/30" onClick={() => {
                    if (currentIndex < didYouKnow.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                    } else {
                        setCurrentIndex(0); // Loop back to the beginning
                    }
                }}>
                    <IconContext.Provider value={{ color: color, size: '20' }}>
                        <MdOutlineKeyboardArrowRight />
                    </IconContext.Provider>
                </button>
            </div>
        </div>
    )
}
