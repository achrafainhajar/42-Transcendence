import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RelationshipModule } from './relationship/relationship.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelMemberModule } from './channel-member/channel-member.module';
import { ChannelActionModule } from './channel-action/channel-action.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './Game/game.module';
import { AchievementModule } from './achievement/achievement.module';
import { UserAchievementModule } from './user-achievement/user-achievement.module';
import { InviteModule } from './Invite/invite.module';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    RelationshipModule,
    ChannelModule,
    ChannelMemberModule,
    ChannelActionModule,
    MessageModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ChatModule,
    GameModule,
    AchievementModule,
    UserAchievementModule,
    InviteModule,
    //RateLimiterModule,
    RateLimiterModule.register({
      for: 'Express',
      type: 'Memory',
      keyPrefix: 'global',
      points: 5000,
      pointsConsumed: 1,
      inmemoryBlockOnConsumed: 0,
      duration: 1,
      blockDuration: 0,
      inmemoryBlockDuration: 0,
      queueEnabled: false,
      whiteList: [],
      blackList: [],
      storeClient: undefined,
      insuranceLimiter: undefined,
      storeType: undefined,
      dbName: undefined,
      tableName: undefined,
      tableCreated: undefined,
      clearExpiredByTimeout: undefined,
      execEvenly: false,
      execEvenlyMinDelayMs: undefined,
      indexKeyPrefix: {},
      maxQueueSize: 100,
      omitResponseHeaders: false,
      errorMessage: 'Rate limit exceeded',
      logger: true,
      customResponseSchema: undefined,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
})
export class AppModule {}
