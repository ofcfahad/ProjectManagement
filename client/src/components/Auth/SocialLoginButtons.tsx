import { useState } from "react";
import UseAnimations from "react-useanimations";
import github from 'react-useanimations/lib/github'
import { FcGoogle } from 'react-icons/fc'
import { IoLogoGoogle } from 'react-icons/io'

const SocialLoginButtons = ({ setLoading, setReference, handleSocialLogin }: { setLoading: (loading: boolean) => void, setReference: (ref: string) => void, handleSocialLogin: (ref: string, setLoading: (loading: boolean) => void, setReference: (ref: string) => void) => void }) => {

    const [ishovering, setIsHovering] = useState('')

    const handleGithubLogin = async () => {
        handleSocialLogin('github', setLoading, setReference)
    }

    const handleGoogleLogin = async () => {
        handleSocialLogin('google', setLoading, setReference)
    }

    return (
        <div className={`flex flex-col items-center w-[300px]`}>

            <button className='!bg-white btn hover:shadow-lg rounded-lg w-1/2 p-0 flex justify-center items-center' onMouseOver={() => setIsHovering('github')} onMouseOut={() => setIsHovering('')} onClick={handleGithubLogin}>
                <div className='flex justify-center items-center py-0.5'>
                    <UseAnimations animation={github} loop={true} />
                    <span className='ml-1 mt-0.5'>
                        Github
                    </span>
                </div>
            </button>

            <button className='bg-white btn hover:shadow-lg rounded-lg w-1/2 mt-2 p-0 flex justify-center items-center' onMouseOver={() => setIsHovering('google')} onMouseOut={() => setIsHovering('')} onClick={handleGoogleLogin}>
                <div className='flex justify-center items-center py-0.5'>
                    {ishovering === 'google' ?
                        <FcGoogle />
                        :
                        <IoLogoGoogle />}
                    <span className='mt-0.5'>
                        oogle
                    </span>
                </div>
            </button>
        </div>
    )
}

export default SocialLoginButtons;