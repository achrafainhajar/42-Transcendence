import { Socket, io } from 'socket.io-client';
import { API_URL } from './constants';

let gsocket: Socket | null = io(API_URL + '/Chat', {
	transports: ['websocket'],
});

export const logoutSocket = (): void => {
	if(gsocket)
		gsocket.emit("DisconnectUser");
	gsocket?.disconnect();
	gsocket = null;
};

export const loginSocket = (): void => {
	if (!gsocket) {
		gsocket = io(API_URL + '/Chat', {
			transports: ['websocket'],
		});
	}
};

export default gsocket;
