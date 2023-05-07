/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectModule from './ProjectModule';

export default function ProjectsWindow({ projectsData, setLoadNewData }: { projectsData: any, setLoadNewData: any }) {

    return (
        <div className='w-full h-full max-h-[10000px] overflow-y-scroll'>
            <div className='w-full flex flex-wrap'>
                {projectsData.map((project: any) => (
                    <div key={project._id} className='ml-2 mt-2 border-dashed border-2 border-black rounded-3xl'>
                        <ProjectModule project={project} setLoadNewData={setLoadNewData} />
                    </div>
                ))}
            </div>
        </div>
    );
}
