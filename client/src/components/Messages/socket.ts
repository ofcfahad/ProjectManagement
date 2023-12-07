import { Socket, io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { DefaultEventsMap } from '@socket.io/component-emitter';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

function getSocket() {
    if (!socket) {
        const token = Cookies.get('session');
        socket = io(URL as string, {
            autoConnect: false,
            auth: { token }
        });
    }
    return socket;
}

export {
    getSocket
}