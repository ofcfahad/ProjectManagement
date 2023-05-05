import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import ProjectModule from './ProjectModule';

export default function ProjectsWindow({ projectsData, setLoadNewData }) {

    return (
        <div className='w-full h-full max-h-[10000px] overflow-y-scroll flex flex-wrap items-center'>
            {projectsData.map((project: any, index: any) => (
                <Draggable key={project._id}>
                    <div className='ml-2 mt-2 border-dashed border-2 border-black rounded-3xl'>
                        <ProjectModule width={'100%'} project={project} titleColor={'#e7b007'} height={undefined} title={undefined} description={undefined} progress={undefined} people={undefined} attachments={undefined} comments={undefined} setLoadNewData={setLoadNewData} />
                    </div>
                </Draggable>
            ))}
        </div>
    );
}
