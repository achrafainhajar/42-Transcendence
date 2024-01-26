import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto } from './dto';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import {
  ChannelRole,
  CreateChannelMemberDto,
  UpdateChannelMemberDto,
} from 'src/channel-member/dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { MessageService } from 'src/message/message.service';
import { BaseGateway } from './base.gateway';
import { ChannelActionService } from 'src/channel-action/channel-action.service';
import { ActionType } from 'src/channel-action/dto/channel-action.dto';
import { ChannelType, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { RelationshipService } from 'src/relationship/relationship.service';
import { UpdateIsOnlineDto } from 'src/user/dto';
import { InviteService } from 'src/Invite/invite.service';
import { off } from 'process';

@Injectable()
export class ChannelService extends BaseGateway {
  constructor(
    private prisma: PrismaService,
    private channelMember: ChannelMemberService,
    private readonly userService: UserService,
    private channelMessage: MessageService,
    private channelAction: ChannelActionService,
    private relationship: RelationshipService,
    private inviteService: InviteService,
  ) {
    super();
  }
  private async isValidRoomName(name: string) {
    if (!name || /\s/.test(name) || name.length < 2 || name.length > 51) {
      return false;
    }
    return true;
  }
  private async generateUniqueIdentifier(): Promise<string> {
    let uniqueIdentifier: string;
    let isUnique: boolean = false;
    while (!isUnique) {
      const randomPart = this.generateRandomString(0, 4);
      uniqueIdentifier = `${randomPart}`;
      const existingChannel = await this.prisma.channel.findUnique({
        where: { uniqueIdentifier: 'CH_' + uniqueIdentifier },
      });
      isUnique = !existingChannel;
    }

    return uniqueIdentifier;
  }
  private generateRandomString(minLength: number, maxLength: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 4;
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }
  /****************************************CHannels*********************************************/
  async create(
    data: CreateChannelDto,
    user: User,
    role: ChannelRole,
    channelIdentifier: string | null,
  ) {
    try {
      if ((await this.isValidRoomName(data.name)) !== true) return;
      let channel = null;
      if (channelIdentifier) {
        channel = await this.prisma.channel.create({
          data: {
            name: data.name,
            type: data.type,
            uniqueIdentifier: channelIdentifier,
          },
        });
      } else {
        let hash = null;
        if (data && data.password) {
          const salt = await bcrypt.genSalt();
          hash = await bcrypt.hash(data.password, salt);
        }
        const uniqueIdentifier = await this.generateUniqueIdentifier();
        channel = await this.prisma.channel.create({
          data: {
            name: data.name + '#' + uniqueIdentifier,
            type: data.type,
            password: hash,
            uniqueIdentifier: 'CH_' + uniqueIdentifier,
          },
        });
      }
      if (user)
        await this.channelMember.addMemberToChannel({
          channel_id: channel.id,
          user_id: user.id,
          role: role,
          avatar: user.avatar,
          username: user.username,
        });
      return channel;
    } catch {
      return null;
    }
  }
  async addMessage(data: any, user: User) {
    if (data.content && data.content.replace(/\s/g, '').length) {
      const res = await this.channelMessage.create({
        content: data.content,
        channel_id: data.channel_id,
        sender_id: user.id,
        avatar: user.avatar,
        username: user.username,
      });
      if (data.type === 'Dms') {
        const channel = await this.findOne(data.channel_id);
        const target = await this.prisma.channelMember.findFirst({
          where: {
            AND: [
              { channel_id: data.channel_id },
              { user_id: { not: user.id } },
            ],
          },
        });
        this.userService.notifyUser(target.user_id, {
          type: 'MESSAGE',
          User: user,
          message: res,
          channel: channel,
        });
      }
    }
  }
  async findAllNonDMChannels(user: User) {
    try {
      return await this.prisma.channel.findMany({
        where: {
          OR: [
            {
              type: {
                in: ['protected', 'public'],
              },
            },
            {
              type: {
                in: ['private'],
              },
              ChannelMembers: {
                some: {
                  user_id: user.id,
                },
              },
            },
          ],
        },
      });
    } catch {
      //console.error('Error fetching non-DM channels:', error);
      //throw error;
    }
  }
  async removeChannel(channel_id: string, user: User) {
    const member = await this.channelMember.getMemberDetails(
      channel_id,
      user.id,
    );
    const channel = await this.findOne(channel_id);

    if (!channel) return;

    if (
      channel.type === ChannelType.dm ||
      (member && member.role === ChannelRole.OWNER)
    ) {
      this.server.emit('kicked', channel_id);
      await this.channelMessage.removeall(channel_id);
      await this.channelAction.removeall(channel_id);
      await this.channelMember.removeall(channel_id);
      await this.remove(channel_id);
      if (channel.type === ChannelType.dm) {
        this.server.emit('goGetMyDms');
      } else {
        this.server.emit('goGetMychannels');
      }
      this.server.socketsLeave(channel_id);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: { id },
        include: {
          Messages: {
            include: {
              Sender: true,
            },
          },
        },
      });
    } catch {
      return null;
    }
  }
  async update_channeltype(
    id: string,
    // type: ChannelType,
    // password: string | null,
    data: UpdateChannelDto
  ) {
    try {
      let hashed_password = null;
      if (data.password) {
        const salt = await bcrypt.genSalt();
        hashed_password = await bcrypt.hash(data.password, salt);
      }
      return await this.prisma.channel.update({
        where: { id },
        data: { type: data.type, password: hashed_password },
      });
    } catch { }
  }
  async update(id: string, data: UpdateChannelDto, user_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id },
      });
      if (!channel) throw new Error('Channel not found');
      const owner = await this.channelMember.getChannelOwner(id);
      const admins = await this.channelMember.getChannelAdmins(id);
      if (
        owner.user_id !== user_id ||
        admins.some((admin) => admin.user_id !== user_id)
      )
        throw new Error('You are not the owner or admin of this channel');
      return await this.prisma.channel.update({ where: { id }, data });
    } catch { }
  }
  async remove(id: string) {
    try {
      return await this.prisma.channel.delete({ where: { id } });
    } catch { }
  }

  async getChannelMembers(channel_id: string) {
    return await this.channelMember.getMembersOfChannel(channel_id);
  }
  async addMember(data: CreateChannelMemberDto, user: User) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: data.channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel || channel.type === ChannelType.dm) {
        throw new Error(`Channel ${data.channel_id} not found`);
      }

      return await this.channelMember.addMemberToChannel({
        channel_id: data.channel_id,
        user_id: user.id,
        avatar: user.avatar,
        role: data.role,
        username: user.username,
      });
    } catch { }
  }
  async getMember(channel_id: string, user_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new Error(`Channel ${channel_id} not found`);
      }
      return await this.channelMember.getMemberDetails(channel_id, user_id);
    } catch { }
  }
  async updateIsOnline(user_id: string, data: UpdateIsOnlineDto) {
    await this.userService.updateIsOnline(user_id, data);
  }
  async updateMemberRole(data: UpdateChannelMemberDto) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: data.channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new Error(`Channel ${data.channel_id} not found`);
      }
      const member = await this.prisma.channelMember.findFirst({
        where: {
          AND: [{ channel_id: data.channel_id }, { user_id: data.user_id }],
        },
      });
      if (!member) {
        throw new Error(
          `Member with user_id ${data.user_id} not found in channel ${data.channel_id}`,
        );
      }
      return await this.channelMember.updateMemberRole(data);
    } catch { }
  }
  async removeMember(channel_id: string, user_id: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channel_id },
        include: { ChannelMembers: true },
      });
      if (!channel) {
        throw new Error(`Channel ${channel_id} not found`);
      }
      return await this.channelMember.removeMemberFromChannel(
        channel_id,
        user_id,
      );
    } catch { }
  }
  async getMessagesByRoomId(room_id: string,user:User) {
    try {
      return await this.channelMessage.findOne(room_id,user.id);
    } catch { }
  }
  async kickMember(user: User, channel_id: string, target_id: string) {
    let member = null;
    let target_m = null;
    const target = this.userService.getClientsOfUser(target_id);
    if (user) {
      target_m = await this.channelMember.getMemberDetails(
        channel_id,
        target_id,
      );
      member = await this.channelMember.getMemberDetails(channel_id, user.id);
    }
    if (
      target &&
      user &&
      member &&
      target_m &&
      ((member.role === ChannelRole.ADMIN &&
        target_m.role === ChannelRole.MEMBER) ||
        member.role === ChannelRole.OWNER)
    ) {
      await this.removeMember(channel_id, target_id);
      await target.forEach((clientId) => {
        this.server.to(clientId).socketsLeave(channel_id);
        this.server.to(clientId).emit('kicked', channel_id);
        this.server.to(clientId).emit('goGetMychannels');
      });
    }
  }
  async banMember(channel_id: string, target_id: string, user: User) {
    let member = null;
    let target_m = null;
    const target = this.userService.getClientsOfUser(target_id);
    if (user) {
      target_m = await this.channelMember.getMemberDetails(
        channel_id,
        target_id,
      );
      member = await this.channelMember.getMemberDetails(channel_id, user.id);
    }
    if (
      target &&
      user &&
      member &&
      target_m &&
      ((member.role === ChannelRole.ADMIN &&
        target_m.role === ChannelRole.MEMBER) ||
        member.role === ChannelRole.OWNER)
    ) {
      await this.channelAction.addActionToChannel({
        channel_id: channel_id,
        actor_id: user.id,
        target_id: target_id,
        action_type: ActionType.BAN,
      });
      await this.kickMember(user, channel_id, target_id);
    }
  }
  async muteMember(user: User, channel_id: string, target_id: string) {
    let member = null;
    let target_m = null;
    const target = this.userService.getClientsOfUser(target_id);
    if (user) {
      target_m = await this.channelMember.getMemberDetails(
        channel_id,
        target_id,
      );
      member = await this.channelMember.getMemberDetails(channel_id, user.id);
    }
    if (
      target &&
      user &&
      member &&
      target_m &&
      ((member.role === ChannelRole.ADMIN &&
        target_m.role === ChannelRole.MEMBER) ||
        member.role === ChannelRole.OWNER)
    )
      await this.channelAction.addActionToChannel({
        channel_id: channel_id,
        actor_id: user.id,
        target_id: target_id,
        action_type: ActionType.MUTE,
        mute_end_at: new Date(new Date().getTime() + 0.3 * 60000),
      });
  }
  async setMemberRole(
    user: User,
    channel_id: string,
    target_id: string,
    role: ChannelRole,
  ) {
    const member = await this.channelMember.getMemberDetails(
      channel_id,
      user.id,
    );
    const target = await this.channelMember.getUniqueChannelOfMember(
      target_id,
      channel_id,
    );
    if (member.role === ChannelRole.OWNER) {
      if (target && target.role !== ChannelRole.OWNER) {
        await this.updateMemberRole({
          channel_id: channel_id,
          user_id: target_id,
          role: role,
          avatar: target.avatar,
          username: target.username,
        });
      }
    }
  }
  async checkban(user: User, channel_id: string) {
    if (!user)
      return 'ban';
    const actions = await this.channelAction.getMyUserActions(
      channel_id,
      user.id,
    );
    if (actions) {
      const is_banned = actions.some((action) => action.action_type === 'ban');

      if (is_banned) return 'ban';
    }
  }
  async checkmute(user_id: string, channel_id: string) {
    const actions = await this.channelAction.getMyUserActions(
      channel_id,
      user_id,
    );
    if (actions) {
      const activeMute = actions.find(
        (action) =>
          action.action_type === 'mute' &&
          new Date(action.mute_end_at) > new Date(),
      );
      if (activeMute) {
        return 'muted';
      } else {
        this.channelAction.deletAction(
          channel_id,
          user_id,
          ActionType.MUTE,
        );
      }
    }
  }
  async validateRoomPassword(
    user: User,
    password: string | undefined,
    channel_id: string,
  ) {
    const channel = await this.findOne(channel_id);
    if (channel && channel.type === ChannelType.protected && user) {
      const member = await this.channelMember.getUniqueChannelOfMember(
        user.id,
        channel_id,
      );
      if (
        !member &&
        password &&
        (await bcrypt.compare(password, channel.password)) === false
      )
        return 'password-incorrect';
      if (!member && (!password || password === undefined))
        return 'password-incorrect';
    }
    if (user) return 'password-correct';
  }
  async leaveMyChannel(
    user: User,
    socket: Socket,
    channel_id: string,
    target_id: string | undefined,
  ) {
    const member = await this.channelMember.getMemberDetails(
      channel_id,
      user.id,
    );
    const target = await this.channelMember.getUniqueChannelOfMember(
      target_id,
      channel_id,
    );
    if (member && target_id && member.role === ChannelRole.OWNER) {
      await this.channelMember.updateMemberRole({
        channel_id: channel_id,
        user_id: target.user_id,
        role: ChannelRole.OWNER,
        avatar: target.avatar,
        username: target.username,
      });
      await this.channelMember.removeMemberFromChannel(channel_id, user.id);
      await this.server
        .to(channel_id)
        .emit('getMembers', await this.getChannelMembers(channel_id));
    } else if (member && member.role === ChannelRole.OWNER) {
      const users = await this.channelMember.getMembersOfChannel(channel_id);
      if (users.length === 1) {
        await this.removeChannel(channel_id, user);
      }
    } else {
      await this.channelMember.removeMemberFromChannel(channel_id, user.id);
      await this.server
        .to(channel_id)
        .emit('getMembers', await this.getChannelMembers(channel_id));
      socket.emit('goGetMychannels');
    }

    socket.leave(channel_id);
    socket.emit('kicked', channel_id);
  }
  async SetChannelPassword(
    channel_id: string,
    password: string,
    user: User,
  ) {
    const member = await this.channelMember.getMemberDetails(
      channel_id,
      user.id,
    );
    if (member && member.role === ChannelRole.OWNER) {
      const data: UpdateChannelDto = {
        type: ChannelType.protected,
        password: password,
      }
      await this.update_channeltype(
        channel_id,
        data
      );
    }
  }
  async RemoveChannelPassword(user: User, channel_id: string) {
    const member = await this.channelMember.getMemberDetails(
      channel_id,
      user.id,
    );
    if (member && member.role === ChannelRole.OWNER) {
      const data: UpdateChannelDto = {
        type: ChannelType.public
      }
      await this.update_channeltype(channel_id,data);
    }
  }
  handleDisconnection(client_id: string) {
    this.userService.removeClient(client_id);
  }
  /****************************************CHannels*********************************************/
  async findAllDMChannels(user: User) {
    try {
      const channels = await this.prisma.channel.findMany({
        where: {
          type: 'dm',
          ChannelMembers: {
            some: {
              user_id: user.id,
            },
          },
        },
        include: {
          ChannelMembers: {
            include: {
              User: true,
            },
          },
        },
      });

      return channels.map((channel) => {
        const otherUser = channel.ChannelMembers.find(
          (member) => member.user_id !== user.id,
        ).User;

        return {
          id: channel.id,
          name: otherUser.username,
          target_id: otherUser.id,
        };
      });
    } catch { }
  }
  async findChannelDm(user: User, target_id: string) {
    try {
      const channelIdentifier = [user.id, target_id].sort().join('-');
      return await this.prisma.channel.findFirst({
        where: {
          uniqueIdentifier: 'DM_' + channelIdentifier,
        },
      });
    } catch {
      return null;
    }
  }
  async check_blocked(user: User, target_id: string) {
    let relation = null;
    const target = await this.userService.findOne(target_id);
    if (target && user) {
      relation = await this.relationship.findByUsers(user.id, target.id);
      if (relation && relation.status === 'blocked') {
        return 'blocked';
      }
      return 'fine';
    }
    return 'blocked';
  }
  async handleDmChannel(target_id: string, user: User, socket: Socket) {
    let channelIdentifier = '';
    if (target_id === user.id) return;
    const target = await this.userService.findOne(target_id);
    if (!user || !target) return;
    channelIdentifier = [user.id, target_id].sort().join('-');
    const channel = await this.findChannelDm(user, target.id);
    if (!channel) {
      const channel_n = await this.create(
        {
          name: user.id,
          type: ChannelType.dm,
        },
        user,
        ChannelRole.MEMBER,
        'DM_' + channelIdentifier,
      );
      if (channel_n) {
        await this.channelMember.addMemberToChannel({
          channel_id: channel_n.id,
          user_id: target_id,
          role: ChannelRole.MEMBER,
          avatar: target.avatar,
          username: target.username,
        });
        socket.join(channel_n.id);
        socket.emit('joined', await this.findOne(channel_n.id));
        this.server.emit('goGetMyDms');
        socket.emit("getmyMembers", await this.channelMember.getMembersOfChannel(channel_n.id));
      }
    }
    if (channel) {
      socket.join(channel.id);
      socket.emit('joined', await this.findOne(channel.id));
      this.server.emit('goGetMyDms');
      socket.emit("getmyMembers", await this.channelMember.getMembersOfChannel(channel.id));
    }
  }
  /****************************************DMS*********************************************/
  async InviteToGame(user: User, target_id: string, mode: string) {
    const target = await this.userService.findOne(target_id);
    if (user && target && target.id != user.id) {
			
      const res = await this.inviteService.create({
        actor_id: user.id,
        target_id: target_id,
        mode: mode,
      });
	  if(res)
    	this.userService.notifyUser(target_id, {
        type: 'GAME_INV',
        User: user,
        invite: { ...res, status: 'pending' },
      });
    }
  }
  async RemoveInvite(user: User, invite_id: string | undefined) {
    if (user && invite_id) {
      return await this.inviteService.RemoveInvite(invite_id, user.id);
    }
  }
  async FindAllReq(user: User, socket: Socket) {
    socket.emit('MyInvites', await this.inviteService.findAllMyReq(user.id));
  }
  async AcceptReq(socket: Socket, invite_id: string, user: User) {
    if (user) {
      const invite = await this.inviteService.findFirst(invite_id, user.id);
      if (invite) {
        const target = await this.userService.findOne(invite.actor_id);
        if (target) {
          if (target.is_in_game === false && target.is_online === true) {
            const clients = this.userService.getClientsOfUser(target.id);
            const clientsArray = Array.from(clients);
            if (clientsArray.length > 0) {
              clientsArray.forEach((client) => {
                this.server
                  .to(client)
                  .emit('GoStartYourGame', { invite_id, role: 'actor' ,mode:invite.mode});
              });
              await this.inviteService.setStart(true, invite_id);
              socket.emit('GoStartYourGame', { invite_id, role: 'target', mode:invite.mode});
            }
          }
        }
      }
    }
  }
  /***********************************Invite To game**************************************************/
}
