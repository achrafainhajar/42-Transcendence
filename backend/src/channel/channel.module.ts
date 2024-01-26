import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { UserModule, UserService } from 'src/user/user.module';
import { RelationshipService } from 'src/relationship/relationship.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { ChatService } from 'src/chat/chat.service';
import { MessageModule } from 'src/message/message.module';
import { MessageService } from 'src/message/message.service';
import { ChannelActionModule } from 'src/channel-action/channel-action.module';
import { ChannelActionService } from 'src/channel-action/channel-action.service';
import { InviteService } from 'src/Invite/invite.service';

@Module({
  imports: [
    ChannelMemberModule,
    UserModule,
    ChatModule,
    MessageModule,
    ChannelActionModule,
  ],
  providers: [
    ChannelService,
    ChannelGateway,
    MessageService,
    UserService,
    RelationshipService,
    ChatGateway,
    ChatService,
    ChannelActionService,
    InviteService,
  ],
  controllers: [ChannelController],
})
export class ChannelModule {}
