import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  icon_url: string;
  @IsNotEmpty()
  @IsNumber()
  points: number;
}

export class UpdateAchievementDto {
  @IsString()
  name?: string;
  @IsString()
  description?: string;
  @IsString()
  icon_url?: string;
  @IsNumber()
  points?: number;
}
