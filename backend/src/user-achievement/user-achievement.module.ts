import { Module } from '@nestjs/common';
import { UserAchievementService } from './user-achievement.service';

@Module({
  providers: [UserAchievementService],
  exports: [UserAchievementService],
})
export class UserAchievementModule {}
