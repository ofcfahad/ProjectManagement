import { Request, Response } from 'express';
import Project from '../database/Schemas/Project';
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';
import { getPayloadfromToken } from './functions';
import { excludedFields } from './User';

//Get the Projects Data from Database
async function getAllProjects(req: Request, res: Response) {
  try {
    const token = req.headers.authorization;
    const userId = getPayloadfromToken(token).userId;

    const projects = await Project.find(
      {
        $or: [{ owner: userId }, { people: userId }],
      }
    ).populate({ path: 'owner people', select: excludedFields })

    res.json(projects);
  } catch (err) {
    console.log("🚀 ~ file: Project.ts:23 ~ getAllProjects ~ err:", err)
    res.status(500).json({ message: 'Server Error' });
  }
}

//Get searched Projects Data from Database
async function getSearchedProjects(req: Request, res: Response) {
  try {
    const token = req.headers.authorization;
    const userId = getPayloadfromToken(token).userId;

    const { searchQuery } = req.body;

    const sanitizedSearchQuery = sanitizeHtml(searchQuery).trim();

    if (!validator.isLength(sanitizedSearchQuery, { min: 1, max: 20 })) {
      return res.status(400).json({ error: 'Invalid search query length.' });
    }
    const query = {
      title: {
        $regex: sanitizedSearchQuery,
        $options: 'i',
      },
      owner: userId,
    };

    const projects = await Project.find(query).populate({ path: 'owner people', select: excludedFields });
    res.status(200).json(projects);
  } catch (err) {
    console.log("🚀 ~ file: Project.ts:52 ~ getSearchedProjects ~ err:", err)
    res.status(500).json({ message: 'Server Error' });
  }
}

//Create new Project
function createProject(req: Request, res: Response) {
  const projectsData = req.body.project;

  const newProject = new Project(projectsData);
  newProject.save()
    .then(() => res.status(200).send('Project Created successfully'))
    .catch((err: Error) => {
      console.log("🚀 ~ file: Project.ts:65 ~ createProject ~ err:", err)
      res.status(400).send(err.message);
    });
}

//Delete Project
async function deleteProject(req: Request, res: Response) {
  const token = req.headers.authorization;
  const userId = getPayloadfromToken(token).userId;

  const { projectId } = req.body;

  try {
    const project = await Project.findById(projectId);
    const owner = (project?.owner._id)?.toString();

    if (userId === owner) {
      const deletedProject = await Project.findByIdAndDelete(projectId);
      if (!deletedProject) {
        res.status(404).json({ error: `Project with ID ${projectId} not found` });
        return;
      }
      res.status(200).json({ message: `Project with ID ${projectId} deleted successfully` });
    } else {
      await Project.updateOne(
        { _id: projectId },
        { $pull: { people: userId } },
      );
      res.status(200).json({ message: `Project with ID ${projectId} deleted successfully` });
    }
  } catch (error) {
    console.log("🚀 ~ file: Project.ts:96 ~ deleteProject ~ error:", error)
    res.status(500).json({ error: 'Internal server error' });
  }
}

export {
  getAllProjects,
  getSearchedProjects,
  createProject,
  deleteProject,
};