import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUUID,
  IsBoolean,
  IsDefined,
  IsOptional
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  avatar: string;

  createdAt: Date;

  updatedAt: Date;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'username' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'email@gmail.com' })
  email: string;
}

export class UpdateUserDto {
  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'username' })
  username: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'email@gmail.com' })
  email: string;

  @IsBoolean()
  @IsOptional()
  rejectImageType?: boolean;
  
  @IsBoolean()
  @IsOptional()
  rejectImageSize?: boolean;
}
export class UpdateIsOnlineDto {
  @IsBoolean()
  @IsNotEmpty()
  is_online: boolean;
}
export class UpdateIsInGameDto {
  @IsBoolean()
  @IsNotEmpty()
  is_in_game: boolean;
}
