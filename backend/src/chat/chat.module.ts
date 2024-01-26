import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { RelationshipService } from '../relationship/relationship.service';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [],
  providers: [ChatService, UserService, RelationshipService,ChannelMemberService,MessageService],
})
export class ChatModule {}
