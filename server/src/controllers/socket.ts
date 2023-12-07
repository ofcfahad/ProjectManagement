import { Server } from "socket.io";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { addMessage } from "./Chats";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

const users: { [user_id: string]: { socket_id: string } } = {};

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    jwt.verify(token, process.env.SECRET_KEY!, (err: any, decoded: any) => {
        if (err) {
            console.log(err);
            
            return next(new Error('Authentication error'));
        }
        next();
    });
});

io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;

    const payload = jwt.verify(token, process.env.SECRET_KEY!, { complete: true }).payload as JwtPayload;
    const user_id = payload.userId;

    users[user_id] = { socket_id: socket.id };

    console.log(`${user_id} connected`);

    socket.on('disconnect', () => {
        const userId = Object.keys(users).find(
            (key) => users[key].socket_id == socket.id
        );
        if (userId) {
            delete users[userId];
        }
        console.log(`${user_id} disconnected`);
    });

    socket.on('checkforUserOnline', async (data: any) => {
        if (data.user in users) {
            socket.emit('userActivity', true);
        } else {
            socket.emit('userActivity', false);
        }
    });

    socket.on('joinChat', async (chat_id: string) => {
        socket.join(chat_id);
        console.log(`${user_id} joined ${chat_id}`);
    })

    socket.on('leaveChat', async (chat_id: string) => {
        socket.leave(chat_id);
        console.log(`${user_id} left ${chat_id}`);
    })

    socket.on('chat message', async (data: any) => {
        const message = await addMessage(data.message);

        io.to(data.message.chat_id).emit('chat message', message);
    });

});

export default io;