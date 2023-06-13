/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const fetchProjectsData = async (setFetchingData: any, setProjectsData: any, setLoadNewData: any, userId: string, session: string) => {
    try {
        setFetchingData(true)
        const response = await axios.post(`/server/api/projectsData`, { userId }, { headers: { Authorization: session } })

        if (!response) {
            throw new Error('Network response was not ok');
        }

        const data = await response.data
        setProjectsData(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoadNewData(false);
        setFetchingData(false)
    }
};

const fetchSearchedProjectsData = async (setFetchingData: any, setLoadNewData: any, setNoSearchedProjects: any, setSearchedProjectsData: any, userId: string, session: string, searchContent: string) => {
    try {
        setFetchingData(true)
        const response = await axios.post(`/server/api/searchedProjectsData`, { userId, searchQuery: searchContent }, { headers: { Authorization: session } })

        if (!response) {
            throw new Error('Network response was not ok');
        }

        if (response.data.length === 0) {
            setNoSearchedProjects(true)
        }
        else {
            const data = await response.data
            setSearchedProjectsData(data);
            setNoSearchedProjects(false)
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoadNewData(false)
        setFetchingData(false)
    }
}


export {
    fetchProjectsData,
    fetchSearchedProjectsData
}