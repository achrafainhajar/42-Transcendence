import { Module } from '@nestjs/common';
import { GameGateway } from './Game.gateway';
import { RoomService } from './Room.service';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UserModule } from 'src/user/user.module';
import { AchievementModule } from 'src/achievement/achievement.module';
import { InviteService } from 'src/Invite/invite.service';
import { InviteModule } from 'src/Invite/invite.module';

@Module({
  imports: [UserModule, AchievementModule, InviteModule],
  providers: [GameGateway, RoomService, GameService, InviteService],
  controllers: [GameController],
})
export class GameModule {}
