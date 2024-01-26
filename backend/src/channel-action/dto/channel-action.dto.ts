import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum ActionType {
  KICK = 'kick',
  BAN = 'ban',
  MUTE = 'mute',
}
export class CreateChannelActionDto {
  @IsNotEmpty()
  @IsUUID()
  channel_id: string;
  @IsNotEmpty()
  @IsUUID()
  actor_id: string;
  @IsNotEmpty()
  @IsUUID()
  target_id: string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(ActionType)
  action_type: ActionType;
  @IsDate()
  mute_end_at?: Date;
}
