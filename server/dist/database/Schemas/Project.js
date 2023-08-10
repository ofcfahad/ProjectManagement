"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProjectSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    accentColor: String,
    tasks: Array,
    completedtasks: Array,
    progress: Number,
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
    Dates: {
        created: {
            type: String,
            default: Date.now(),
        },
        started: Date,
    },
    people: Array,
    attachments: Number,
    comments: Number,
});
const Project = mongoose_1.default.model('projectsData', ProjectSchema, 'projectsData');
exports.default = Project;
//# sourceMappingURL=Project.js.map