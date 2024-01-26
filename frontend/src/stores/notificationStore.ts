// make a zustand store for notifications that can be used in any component  it can store many Notification objects and keeps order of them

import { create } from 'zustand';
import { Notification } from '../types/notification';
import socket from "../socket";

//const notificationChannel = new BroadcastChannel('notification_channel');
// add way to update read status of a notification 
type NotificationStore = {
	notifications: Notification[];
	addNotification: (notification: Notification) => void;
	removeNotification: (notification: Notification, emit?: boolean) => void;
	readNotification: (notification: Notification, emit?: boolean) => void;
	setNotification: (notification: Notification, emit?: boolean) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
	notifications: [],
	addNotification: (notification) =>
		set((state) => {
			const idx1 = state.notifications.findIndex((n => n.type === "GAME_INV" && "GAME_INV" === notification.type  && n.invite.id === notification.invite.id))
			if(idx1 !== -1)
				return {notifications: state.notifications};
			const idx = state.notifications.findIndex((n => n.id === notification.id))
			if(idx == -1)
			return {notifications: [...state.notifications, notification]}
			return{notifications: state.notifications};
			// notifications: [...state.notifications, notification],
		}),
	removeNotification: (notification, emit = true) => {
		if (emit)
			socket?.emit('UpdateNotif', { ...notification, is_deleted: true })
			return  set((state) => ({
			notifications: state.notifications.filter(
				(n) => n.id !== notification.id
			),
		}))
	},
	readNotification: (notification, emit = true) => {
		if (emit)
			socket?.emit('UpdateNotif', { ...notification, read: true })
			return  set((state) => ({

			notifications: state.notifications.map((n) =>
				n.id === notification.id ? { ...n, read: true } : n
			),
		}))
	},
	setNotification: (notification: Notification, emit = true) => {
		return set((state) => {
			const idx = state.notifications.findIndex((n => n.id === notification.id))
			if (idx !== -1)
				state.notifications[state.notifications.findIndex((n => n.id === notification.id))] = {...notification}
			if (emit && idx !== -1)
				socket?.emit('UpdateNotif', notification)
			return {
				notifications: state.notifications,
			}
		})
	}
}));

//useNotificationStore.subscribe(state => {
//	localStorage.setItem('notifications', JSON.stringify(state.notifications));
//	notificationChannel.postMessage({ type: 'update', notifications: state.notifications });
//});

//notificationChannel.onmessage = (message) => {
//	if (message.data.type === 'update') {
//		useNotificationStore.setState({ notifications: message.data.notifications });
//	}
//};

