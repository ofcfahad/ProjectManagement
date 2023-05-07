/* eslint-disable @typescript-eslint/no-explicit-any */
import { backgroundImage } from '../assets'
import Loading from './Loading'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const LoggingLoading = ({ reference, setLoading }: { reference: string, setLoading: any }) => {


    return (
        <div className='w-full h-full flex justify-center items-center' style={{ backgroundImage: backgroundImage }}>
            <div className='w-[40%] h-[40%] bg-white/30  backdrop-blur rounded-3xl flex flex-col '>
                <div className='w-full flex items-center p-4'>
                    <ArrowLeftIcon className='w-8 cursor-pointer' onClick={() => setLoading(false)} />
                </div>
                <div className='py-10 flex flex-col justify-center items-center'>
                    {
                            reference === 'main' ?
                                <span className='font-josefin text-2xl'>
                                    Loading
                                </span>
                                :
                                <span className='font-josefin text-2xl'>
                                    Please Authenticate With Your <strong>{reference}</strong> account.
                                    <br />
                                    Authentication Page opened in Another Tab.
                                </span>
                    }
                    <div className='mt-5'>
                        <Loading haveBackgroundColor={false} backgroundColor={''} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoggingLoading