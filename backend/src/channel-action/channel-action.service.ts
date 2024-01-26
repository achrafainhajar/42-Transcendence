import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelActionDto } from './dto/channel-action.dto';
import { ActionType } from '@prisma/client';

@Injectable()
export class ChannelActionService {
  constructor(private prisma: PrismaService) {}
  async addActionToChannel(data: CreateChannelActionDto) {
    try {
      await this.prisma.channelAction.create({
        data,
      });
    } catch (err) {
    }
  }

  async getMyUserActions(channel_id: string, user_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelActions: true },
      });
      if (!channel) {
        throw new NotFoundException(`Channel ${channel_id} not found`);
      }
      return await this.prisma.channelAction.findMany({
        where: { channel_id: channel_id, target_id: user_id },
      });
    } catch {}
  }
  async deletAction(
    channel_id: string,
    user_id: string,
    action_type: ActionType,
  ) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelActions: true },
      });
      if (!channel) {
        throw new NotFoundException(`Channel ${channel_id} not found`);
      }
      return await this.prisma.channelAction.deleteMany({
        where: {
          channel_id: channel_id,
          target_id: user_id,
          action_type: action_type,
        },
      });
    } catch (err) {
      return null;
    }
  }
  async removeall(channel_id: string) {
    try {
      await this.prisma.channelAction.deleteMany({
        where: { channel_id: channel_id },
      });
    } catch {}
  }
}
