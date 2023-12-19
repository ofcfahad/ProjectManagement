/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from './Loading'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const LoggingLoading = ({ reference, canPop = false, onBackArrowClick = () => { } }: { reference: string, canPop: boolean, onBackArrowClick: () => void }) => {

    return (
        <div className={`h-[100vh] w-full flex justify-center items-center`}>
            <div className='w-[40%] h-[40%] bg-white/30 backdrop-blur rounded-3xl flex flex-col '>
                {
                    canPop &&
                    <div className='w-full flex items-center p-4 h-[10%]'>
                        <ArrowLeftIcon className='w-8 cursor-pointer' onClick={onBackArrowClick} />
                    </div>
                }
                <div className='h-[90%] flex flex-col justify-center items-center'>
                    {
                        reference === 'main' ?
                            <span className='text-xl'>
                                Loading
                            </span>
                            :
                            <span className='text-xl text-center'>
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