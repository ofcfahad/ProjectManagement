/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectModule from './ProjectModule';
import { motion } from 'framer-motion';

export default function ProjectsWindow({ projectsData, setLoadNewData, isHovered }: { projectsData: any, setLoadNewData: any, isHovered: any }) {

    return (
        <div className='w-full h-full max-h-[10000px] overflow-y-scroll relative'>
            <div className='w-full flex flex-wrap'>
                {projectsData.map((project: any) => (
                    <motion.div
                        key={project._id}
                        className={`ml-2 mt-2 rounded-3xl`}
                        style={{ height: 200, width: 270 }}
                    >
                        <div>
                            <ProjectModule
                                height={200}
                                width={270}
                                project={project}
                                setLoadNewData={setLoadNewData}
                                isHovered={isHovered}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
