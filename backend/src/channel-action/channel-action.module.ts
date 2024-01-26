import { Module } from '@nestjs/common';
import { ChannelActionService } from './channel-action.service';

@Module({
  providers: [ChannelActionService],
})
export class ChannelActionModule {}
