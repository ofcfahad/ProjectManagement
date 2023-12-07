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
    ref: 'appUsers',
    required: true,
  },
  Dates: {
    created: {
      type: String,
      default: Date.now(),
    },
    started: Date,
  },
  people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appUsers' }],
  attachments: Number,
  comments: Number,
});

const Project = mongoose.model('projectsData', ProjectSchema, 'projectsData');

export default Project;