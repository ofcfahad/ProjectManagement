import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appUsers' }],
    dates: {
        startedAt: Date,
        lastMessage: Date,
    },
});

const User = mongoose.model('userChats', ChatSchema, 'userChats');

export default User;