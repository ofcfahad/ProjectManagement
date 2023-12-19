import { Skeleton } from 'antd';

function SkeletonChat() {
    return (
        <div className="w-full p-2 flex flex-col gap-2">

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
            </div>

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
            </div>

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
            </div>

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <div className='w-40'>
                    <Skeleton.Input active={true} size={'small'} block />
                </div>
            </div>

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <Skeleton.Image active={true} />
            </div>

            <div className="px-4 flex justify-end gap-2">
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
            </div>

            <div className="px-4 flex justify-end gap-2">
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
            </div>

            <div className="px-4 flex justify-end gap-2">
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
            </div>

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <div className='w-40'>
                    <Skeleton.Input active={true} size={'small'} block />
                </div>
            </div>

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <Skeleton.Image active={true} />
            </div>

            <div className="px-4 flex justify-end gap-2">
                <div className='w-40'>
                    <Skeleton.Input active={true} size={'small'} block />
                </div>
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
            </div>

            <div className="px-4 flex justify-end gap-2">
                <Skeleton.Image active={true} />
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
            </div>

            <div className="px-4 flex justify-start gap-2">
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
            </div>

            <div className="px-4 flex justify-end gap-2">
                <div className='w-40'>
                    <Skeleton.Button active={true} size={'large'} shape={'round'} block />
                </div>
                <div className="flex items-end">
                    <Skeleton.Avatar active={true} size={30} shape={'circle'} />
                </div>
            </div>
        </div>
    )
}

export default SkeletonChat