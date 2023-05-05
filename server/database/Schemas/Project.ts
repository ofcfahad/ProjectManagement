import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    //id: Number,
    title: String,
    description: String,
    tasks: Array,
    completedtasks: Array,
    progress: Number,
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    people: Array,
    attachments: Number,
    comments: Number
})

// ProjectSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         const lastProject = await Project.findOne({}, {}, { sort: { id: -1 } });
//         this.id = lastProject ? lastProject.id + 1 : 1;
//     }
//     next();
// });

const Project = mongoose.model('projectsData', ProjectSchema, 'projectsData');

export default Project