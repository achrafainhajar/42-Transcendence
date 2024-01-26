import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelMemberDto, UpdateChannelMemberDto } from './dto';

@Injectable()
export class ChannelMemberService {
  constructor(private prisma: PrismaService) { }

  async addMemberToChannel(data: CreateChannelMemberDto) {
    try {
      await this.prisma.channelMember.create({
        data,
      });
    } catch { }
  }
  async updateAllChannelMembersOfUser(updateData: UpdateChannelMemberDto) {
    try {
      const { username, user_id, avatar } = updateData;
      await this.prisma.channelMember.updateMany({
        where: {
          user_id: user_id,
        },
        data: {
          username:username,
          avatar:avatar,
        }
      });
    }
    catch
    {

    }
  }
  async getTheFirstMember(channel_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new NotFoundException(`Channel ${channel_id} not found`);
      }
      return await this.prisma.channelMember.findFirst({
        where: { channel_id },
      });
    } catch { }
  }
  async getMembersOfChannel(channel_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new NotFoundException(`Channel ${channel_id} not found`);
      }
      return await this.prisma.channelMember.findMany({
        where: { channel_id },
      });
    } catch { }
  }
  async getChannelsOfMember(member_id: string) {
    try {
      return await this.prisma.channelMember.findMany({
        where: { user_id: member_id },
      });
    } catch { }
  }
  async getUniqueChannelOfMember(member_id: string, channel_id: string) {
    try {
      return await this.prisma.channelMember.findFirst({
        where: { user_id: member_id, channel_id: channel_id },
      });
    } catch { }
  }
  async getMemberDetails(channel_id: string, user_id: string) {
    try {
      const member = await this.prisma.channelMember.findFirst({
        where: {
          AND: [{ channel_id: channel_id }, { user_id: user_id }],
        },
      });
      if (!member) {
        throw new NotFoundException(
          `Member with user_id ${user_id} not found in channel ${channel_id}`,
        );
      }
      return member;
    } catch { }
  }

  async removeMemberFromChannel(channel_id: string, user_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new NotFoundException(`Channel ${channel_id} not found`);
      }
      return await this.prisma.channelMember.delete({
        where: {
          channel_id_user_id: { channel_id, user_id },
        },
      });
    } catch { }
  }

  async updateMemberRole(data: UpdateChannelMemberDto) {
    try {
      const { channel_id, user_id, role } = data;
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new NotFoundException(`Channel ${channel_id} not found`);
      }
      const member = await this.prisma.channelMember.findFirst({
        where: {
          AND: [{ channel_id: channel_id }, { user_id: user_id }],
        },
      });
      if (!member) {
        throw new NotFoundException(
          `Member with user_id ${user_id} not found in channel ${channel_id}`,
        );
      }
      return await this.prisma.channelMember.update({
        where: {
          channel_id_user_id: { channel_id, user_id },
        },
        data: { role },
      });
    } catch { }
  }

  async getChannelOwner(channel_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new NotFoundException(`Channel ${channel_id} not found`);
      }
      const member = await this.prisma.channelMember.findFirst({
        where: {
          AND: [{ channel_id: channel_id }, { role: 'owner' }],
        },
      });
      if (!member) {
        throw new NotFoundException(`Owner not found in channel ${channel_id}`);
      }
      return member;
    } catch { }
  }
  async getChannelAdmins(channel_id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channel_id },
      include: { ChannelMembers: true },
    });
    if (!channel) {
      throw new NotFoundException(`Channel ${channel_id} not found`);
    }
    return await this.prisma.channelMember.findMany({
      where: {
        AND: [{ channel_id: channel_id }, { role: 'admin' }],
      },
    });
  }
  async removeall(channel_id: string) {
    try {
      await this.prisma.channelMember.deleteMany({
        where: { channel_id: channel_id },
      });
    } catch { }
  }
}
