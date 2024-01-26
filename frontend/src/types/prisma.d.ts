

export type ChannelType = 'public' | 'private' | 'protected' | 'dm';
export type RelationshipStatus = 'pending' | 'friends' | 'blocked';
export type ChannelRole = 'owner' | 'admin' | 'member';
export type ActionType = 'kick' | 'ban' | 'mute';

export type User = {
	id: string;
	is_profile_finished: boolean;
	oauth_id: string;
	username: string;
	email: string;
	avatar: string;
	is_online: boolean;
	is_in_game: boolean;
	two_factor_auth_enabled: boolean;
	two_factor_secret: string;
	two_factor_uuid: string;
	created_at: Date;
	updated_at: Date;
}

export type Relationship = {
	id: string;
	user1_id: string;
	user2_id: string;
	status: RelationshipStatus;
	created_at: Date;
	updated_at: Date;
}

export type Invite = {
	id: string;
	actor_id: string;
	target_id: string;
	start: boolean;
	status: "accepted" | "rejected" | "pending";
	created_at: Date;
	updated_at: Date;
}

export type Channel = {
	id: string;
	name: string;
	uniqueIdentifier: string;
	type: ChannelType;
	password: string;
	created_at: Date;
	updated_at: Date;
}

export type Message = {
	id: string;
	channel_id: string;
	sender_id: string;
	reply_to_id: string;
	content: string;
	created_at: Date;
	updated_at: Date;
}
