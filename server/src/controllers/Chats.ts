import { Request, Response } from 'express';
import { getUserIdfromToken } from './functions'
import User from '../database/Schemas/User';
import Chat from '../database/Schemas/Chat';
import { excludedFields } from './User';
import Message from '../database/Schemas/Message';
import mongoose from 'mongoose';

function moveMessages(chats: any) {
    for (let i = 0; i < chats.length; i++) {
        const messages = chats[i].messages;
        for (let j = 0; j < messages.length; j++) {
            const message = messages[j]
            const newMessage = new Message({
                chat_id: chats[i]._id,
                sender: message.sender,
                content: { text: message.text },
                sent: message.sent
            })
            newMessage.save();
        }
    }
}

const getAllChats = async (userId: string) => {
    try {
        var chats = await Chat.find({ participants: userId }).populate({ path: 'participants', select: excludedFields }) // get Chats by userId        
        return chats;
    } catch (error) {
        return new Error('invalid token');
    }
}

const getUserChats = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const userId = getUserIdfromToken(token);

        const chats = await getAllChats(userId); // get Chats by userId

        res.status(200).json(chats); // sends Chats as json
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getChatMessages = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.body;

        const messages = await Message.find({ chat_id: chatId }).populate({ path: 'sender', select: excludedFields });
        res.status(200).json(messages);
    } catch (error) {
        console.log("🚀 ~ file: Chats.ts:54 ~ getChatMessages ~ error:", error)
        res.status(500).json({ message: 'Server Error' });
    }
}

const createNewChat = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const { recipient } = req.body;

        const userId = getUserIdfromToken(token); // userId from token payload

        const user = await User.findById(recipient); // get User by userId
        if (user) {
            const participants = [userId, recipient];

            var newChat = new Chat({
                participants,
                messages: [],
                dates: {
                    startedAt: new Date(),
                }
            });
            await newChat.save();

            const chats = await getAllChats(userId); // get Chats by userId

            res.status(200).json(chats);
        } else {
            return res.json('invalid recipient');
        }

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addMessage = async (message: any) => {
    try {
        //const user = await User.findById(message.sender);
        const _message = new Message({
            chat_id: message.chat_id,
            sender: message.sender,
            content: message.content,
            sent: message.sent,
        })
        await _message.save();

        return await Message.findById(_message._id).populate({ path: 'sender', select: excludedFields });
    } catch (error) {
        console.log("🚀 ~ file: Chats.ts:104 ~ addMessage ~ error:", error)
    }
}

export {
    getUserChats,
    getChatMessages,
    createNewChat,
    addMessage,
}