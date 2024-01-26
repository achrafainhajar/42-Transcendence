import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum ChannelRole {
  OWNER = 'owner',
  MEMBER = 'member',
  ADMIN = 'admin',
}

export class CreateChannelMemberDto {
  @IsNotEmpty()
  @IsUUID()
  channel_id: string;
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
  @IsNotEmpty()
  @IsString()
  avatar:string;
  @IsNotEmpty()
  @IsString()
  username:string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(ChannelRole)
  role: ChannelRole;
}

export class UpdateChannelMemberDto extends CreateChannelMemberDto {}
