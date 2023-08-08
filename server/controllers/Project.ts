import { Request, Response } from 'express'
import Project from '../database/Schemas/Project'
import sanitizeHtml from 'sanitize-html'
import validator from 'validator'

//Get the Projects Data from Database
async function getAllProjects(req: Request, res: Response) {
    try {
        const userId = req.body.userId

        const projects = await Project.find({
            $or: [{ owner: userId }, { people: userId }]
        }).populate('people')

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
    const projectsData = req.body.project

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
    const { projectId, userId, owner } = req.body;

    try {
        if (userId === owner) {
            const deletedProject = await Project.findByIdAndDelete(projectId);
            if (!deletedProject) {
                res.status(404).json({ error: `Project with ID ${projectId} not found` });
                return;
            }
            res.status(200).json({ message: `Project with ID ${projectId} deleted successfully` });
        } else {
            const project = await Project.updateOne(
                { _id: projectId },
                { $pull: { people: userId } }
            );
            res.status(200).json({ message: `Project with ID ${projectId} deleted successfully` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteManyProjects = async (req: Request, res: Response) => {
    try {
        const { ids, userId } = req.body;
        const Projects: Array<object> = [];
        await Promise.all(ids.map(async (id: string) => {
            try {
                const project = await Project.findById(id)
                const owner = (project?.owner._id)?.toString()
                if (project && owner === userId) {
                    await project.deleteOne()
                    const projectInfo = {
                        id: project._id,
                        title: project.title
                    }
                    Projects.push(projectInfo)
                }
            } catch (error) {
                console.log(`from deleteManyProjects's Promise: ${error}`);
            }
        }));
        res.status(200).json({ Projects })
    } catch (error) {
        console.log(`from deleteManyProjects: ${error}`);
    }
}

export {
    getAllProjects,
    getSearchedProjects,
    createProject,
    deleteProject,
    deleteManyProjects
}