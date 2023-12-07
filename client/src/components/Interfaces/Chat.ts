import { Person } from './Person';
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Chat {
    _id?: any,
    participants: Array<Person>,
    //messages?: Array<Message>,
    dates: {
        startedAt: Date,
        lastMessage?: Date,
    }
}

export interface Message {
    _id?: any,
    chat_id: any,
    sender: Person,
    content: any,
    sent: Date,
    // Other message details like timestamps
}