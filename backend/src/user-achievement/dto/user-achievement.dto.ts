import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserAchievementDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
  @IsNotEmpty()
  @IsUUID()
  achievement_id: string;
}
