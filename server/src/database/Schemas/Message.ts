import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'userChats' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'appUsers' },
    content: { text: String },
    sent: Date,
});

const Message = mongoose.model('userMessages', MessageSchema, 'userMessages');

export default Message;