"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyProjects = exports.deleteProject = exports.createProject = exports.getSearchedProjects = exports.getAllProjects = void 0;
const Project_1 = __importDefault(require("../database/Schemas/Project"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const validator_1 = __importDefault(require("validator"));
//Get the Projects Data from Database
function getAllProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.body.userId;
            const projects = yield Project_1.default.find({
                $or: [{ owner: userId }, { people: userId }],
            }).populate('people');
            res.json(projects);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    });
}
exports.getAllProjects = getAllProjects;
//Get searched Projects Data from Database
function getSearchedProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, searchQuery } = req.body;
            const sanitizedSearchQuery = (0, sanitize_html_1.default)(searchQuery).trim();
            if (!validator_1.default.isLength(sanitizedSearchQuery, { min: 1, max: 20 })) {
                return res.status(400).json({ error: 'Invalid search query length.' });
            }
            const query = {
                title: {
                    $regex: sanitizedSearchQuery,
                    $options: 'i',
                },
                owner: userId,
            };
            const projects = yield Project_1.default.find(query);
            res.status(200).json(projects);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    });
}
exports.getSearchedProjects = getSearchedProjects;
//Create new Project
function createProject(req, res) {
    const projectsData = req.body.project;
    const newProject = new Project_1.default(projectsData);
    newProject.save()
        .then(() => res.status(200).send('Project Created successfully'))
        .catch((err) => {
        console.log(err);
        res.status(400).send(err.message);
    });
}
exports.createProject = createProject;
//Delete Project
function deleteProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId, userId, owner } = req.body;
        try {
            if (userId === owner) {
                const deletedProject = yield Project_1.default.findByIdAndDelete(projectId);
                if (!deletedProject) {
                    res.status(404).json({ error: `Project with ID ${projectId} not found` });
                    return;
                }
                res.status(200).json({ message: `Project with ID ${projectId} deleted successfully` });
            }
            else {
                yield Project_1.default.updateOne({ _id: projectId }, { $pull: { people: userId } });
                res.status(200).json({ message: `Project with ID ${projectId} deleted successfully` });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.deleteProject = deleteProject;
const deleteManyProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids, userId } = req.body;
        const Projects = [];
        yield Promise.all(ids.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                const project = yield Project_1.default.findById(id);
                const owner = (_a = (project === null || project === void 0 ? void 0 : project.owner._id)) === null || _a === void 0 ? void 0 : _a.toString();
                if (project && owner === userId) {
                    yield project.deleteOne();
                    const projectInfo = {
                        id: project._id,
                        title: project.title,
                    };
                    Projects.push(projectInfo);
                }
            }
            catch (error) {
                console.log(`from deleteManyProjects's Promise: ${error}`);
            }
        })));
        res.status(200).json({ Projects });
    }
    catch (error) {
        console.log(`from deleteManyProjects: ${error}`);
    }
});
exports.deleteManyProjects = deleteManyProjects;
//# sourceMappingURL=Project.js.map