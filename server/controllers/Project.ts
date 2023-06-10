import { Request, Response } from 'express'
import Project from '../database/Schemas/Project'
import sanitizeHtml from 'sanitize-html'
import validator from 'validator'

//Get the Projects Data from Database
async function getAllProjects(req: Request, res: Response) {
    try {
        const userId = req.body.userId
        const projects = await Project.find({ owner: userId })
        res.json(projects);
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

//Get searched Projects Data from Database
async function getSearchedProjects(req: Request, res: Response) {
    try {
        const { userId, searchQuery } = req.body

        const sanitizedSearchQuery = sanitizeHtml(searchQuery).trim();

        if (!validator.isLength(sanitizedSearchQuery, { min: 1, max: 20 })) {
            return res.status(400).json({ error: 'Invalid search query length.' });
        }
        const query = {
            title: {
                $regex: sanitizedSearchQuery,
                $options: 'i'
            },
            owner: userId
        };
        const projects = await Project.find(query)
        res.status(200).json(projects);
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

//Create new Project
function createProject(req: Request, res: Response) {
    const projectsData = req.body.finalProject
    
    const newProject = new Project(projectsData)
    newProject.save()
        .then(() => res.status(200).send('Project Created successfully'))
        .catch((err: Error) => {
            console.log(err);
            res.status(400).send(err.message)
        });
}

//Delete Project
async function deleteProject(req: Request, res: Response) {
    const projectId = req.body.projectId;

    try {
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            res.status(404).json({ error: `Project with ID ${projectId} not found` });
            return;
        }
        res.json({ message: `Project with ID ${projectId} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getAllProjects,
    getSearchedProjects,
    createProject,
    deleteProject
}