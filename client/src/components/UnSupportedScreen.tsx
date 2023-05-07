import { IconContext } from "react-icons"
import { SlScreenDesktop } from "react-icons/sl"

const UnSupportedScreen = () => {
    return (
        <div className="bg-sidebarcolor w-full flex justify-center items-center" style={{ height: window.innerHeight }} >
            <div className='text-white font-alkatra relative'>
                <span>
                    <IconContext.Provider value={{ size: '100' }}>
                        <div className="mb-[-55px] ml-3.5"> {window.innerWidth} x {window.innerHeight} </div>
                        <SlScreenDesktop />
                    </IconContext.Provider>
                </span>

                <span>
                    Screen Size not Supported
                </span>
                <br />
                <span className=''>
                    Your Screen Size :
                    <span> {window.innerWidth} x {window.innerHeight} </span>
                </span>
                <br />
                <span className=''>
                    Supported Screen Size :
                    <span> 720 x any and more</span>
                </span>
            </div>
        </div>
    )
}

export default UnSupportedScreen