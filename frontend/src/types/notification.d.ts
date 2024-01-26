import { Relationship, Channel, Message, User, Invite } from './prisma';

export interface NotificationBase {
	type: string;
	User: User;
	id: string;
	created_at: Date;
	read: boolean;
	is_deleted: boolean;
}
export interface UserRelationNotification extends NotificationBase {
	type:
	| 'FRIEND_REQUEST'
	| 'FRIEND_REQUEST_ACCEPTED'
	| 'FRIEND_REQUEST_REJECTED'
	| 'BLOCKED'
	| 'UNBLOCKED';
	relationship: Relationship;
}

export interface GameInvNotification extends NotificationBase {
	type: 'GAME_INV';
	invite: Invite & { status: "accepted" | "rejected" | "pending" };
}

export interface MessageNotification extends NotificationBase {
	type: 'MESSAGE';
	channel: Channel;
	message: Message;
}

export type Notification =
	| UserRelationNotification
	| GameInvNotification
	| MessageNotification;
