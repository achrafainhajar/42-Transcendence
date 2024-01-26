import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';

@Module({
  imports: [UserAchievementModule],
  providers: [AchievementService],
  controllers: [AchievementController],
  exports: [AchievementService],
})
export class AchievementModule {}
