import React, { createContext, ReactNode, useState } from 'react';
import { Project } from '../../Interfaces';
import { useApi } from '..';

interface ProjectsDataContextProps {
    addProject: (project: Project) => void;
    removeProject: (projectId: string) => void;
    getProjectsData: () => Project[];
    getProjectsDatafromDatabase: () => void;
    reset: () => void
}

export const ProjectsDataContext = createContext<ProjectsDataContextProps | undefined>(undefined);

const ProjectsDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Array<Project>>([]);
    
    const { fetchProjectsData } = useApi();

    const addProject = (project: Project) => {
        setProjects([...projects, project])
    };

    const removeProject = (projectId: string) => {
        const filteredProjects = projects.filter((project) => {
            console.log(project._id, projectId); // Debugging line
            return project._id !== projectId;
        });
        setProjects(filteredProjects)
    };

    const getProjectsData = () => {
        return projects;
    };

    const getProjectsDatafromDatabase = async () => {
        await fetchProjectsData()
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const reset = () => {
        setProjects([])
    }

    const contextValue: ProjectsDataContextProps = {
        getProjectsData,
        getProjectsDatafromDatabase,
        addProject,
        removeProject,
        reset
    };

    return (
        <ProjectsDataContext.Provider value={contextValue}>
            {children}
        </ProjectsDataContext.Provider>
    );
};

export default ProjectsDataContextProvider;
