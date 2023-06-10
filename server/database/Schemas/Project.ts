import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    accentColor: String,
    tasks: Array,
    completedtasks: Array,
    progress: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    Dates: {
        creation: {
            type: Date,
            default: Date.now()
        },
        started: Date
    },
    people: Array,
    attachments: Number,
    comments: Number
})

const Project = mongoose.model('projectsData', ProjectSchema, 'projectsData');

export default Project