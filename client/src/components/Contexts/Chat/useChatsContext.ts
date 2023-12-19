import { useContext } from 'react';
import { ChatsContext } from './ChatsContext';

const useChats = () => {
  const context = useContext(ChatsContext);
  if (!context) {
    throw new Error('useProjectsData must be used within a ChatsContextProvider');
  }
  return context;
};

export default useChats