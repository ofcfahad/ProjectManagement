import React, { createContext, ReactNode, useState } from 'react';
import { Project } from '../../interfaces';

interface ProjectsDataContextProps {
    projectsData: Array<Project>;
    addProject: (project: Project) => void;
    removeProject: (projectId: string) => void;
    removeProjects: (projectIds: Array<string>) => void;
    setProjectsData: (projects: Array<Project>) => void;
}

export const ProjectsDataContext = createContext<ProjectsDataContextProps | undefined>(undefined);

const ProjectsDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Array<Project>>([]);

    const addProjectFunc = (project: Project) => {
        setProjects([...projects, project])
    };
    
    const removeProjectFunc = (projectId: string) => {
        const filteredProjects = projects.filter((project) => {
            console.log(project._id, projectId); // Debugging line
            return project._id !== projectId;
        });
        setProjects(filteredProjects)
    };
    
    const removeProjectsByIds = (projectIds: string[]) => {
        const filteredProjects = projects.filter((project) => !projectIds.includes(project._id));
        setProjects(filteredProjects);
    };

    const setProjectsDataFunc = (myprojects: Array<Project>) => {
        setProjects(myprojects)
    };

    const contextValue: ProjectsDataContextProps = {
        projectsData: projects,
        addProject: addProjectFunc,
        removeProject: removeProjectFunc,
        removeProjects: removeProjectsByIds,
        setProjectsData: setProjectsDataFunc,
    };

    return (
        <ProjectsDataContext.Provider value={contextValue}>
            {children}
        </ProjectsDataContext.Provider>
    );
};

export default ProjectsDataContextProvider;
