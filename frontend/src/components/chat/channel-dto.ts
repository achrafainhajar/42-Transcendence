export enum ChannelType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PROTECTED = 'protected',
    DM = 'dm'
}

export interface CreateChannelDto {
    id:string;
    name: string;
    type: ChannelType;
    target_id?:string;
    password?: string;
}
export interface UpdateChannelDto {
    name?: string;
    type?: ChannelType;
    password?: string;
}
