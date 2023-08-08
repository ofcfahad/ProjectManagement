import { useContext } from 'react';
import { ProjectsDataContext } from './ProjectsDataContext';

export const useProjectsData = () => {
  const context = useContext(ProjectsDataContext);
  if (!context) {
    throw new Error('useProjectsData must be used within a ProjectsDataContextProvider');
  }
  return context;
};
