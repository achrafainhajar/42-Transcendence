import { ChannelType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(ChannelType)
  type: ChannelType;
  @IsString()
  password?: string;
}
export class UpdateChannelDto {
  @IsString()
  name?: string;
  @IsString()
  @IsEnum(ChannelType)
  type?: ChannelType;
  @IsString()
  password?: string;
}
