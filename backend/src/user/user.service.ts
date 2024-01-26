import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateIsOnlineDto, UpdateUserDto } from './dto';
import { RelationshipService } from 'src/relationship/relationship.service';
import { CreateRelationshipDto } from 'src/relationship/dto';
import {
  RelationshipStatus,
  UpdateRelationshipDto,
} from 'src/relationship/dto/relationship.dto';
import { User } from '@prisma/client';
import { unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { Socket } from 'socket.io';

import { UpdateIsInGameDto } from './dto/user.dto';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { MessageService } from 'src/message/message.service';
import { ChannelRole } from 'src/channel-member/dto';
import { Notification } from 'src/user/types/notification';
import { ulid } from 'ulid';
const unlinkAsync = promisify(unlink);

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private relationshipService: RelationshipService,
    private channelMember: ChannelMemberService,
    private channelMessage: MessageService,
  ) {}

  private static clientToUserMap = new Map<string, string>();
  private static socketclientsMap = new Map<string, Socket>();

  getClientsOfUser(userId: string): Set<string> {
    const clientIds = new Set<string>();
    for (const [
      clientId,
      userIdAssociated,
    ] of UserService.clientToUserMap.entries()) {
      if (userIdAssociated === userId) {
        clientIds.add(clientId);
      }
    }
    return clientIds;
  }

  async getUserOfClient(clientId: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: UserService.clientToUserMap.get(clientId),
        },
      });
    } catch {
    }
  }

  addClientSocket(socket: Socket) {
    UserService.socketclientsMap.set(socket.id, socket);
  }
  removeClientSocket(socketId: string) {
    UserService.socketclientsMap.delete(socketId);
  }

  addClientToUser(userId: string, clientId: string) {
    UserService.clientToUserMap.set(clientId, userId);
  }

  removeClient(clientId: string) {
    UserService.clientToUserMap.delete(clientId);
  }
  getAllConnectedUsers() {
    return Array.from(new Set(UserService.clientToUserMap.values()));
  }

  notifyUser(userId: string, notification: Notification) {
    const clientIds = this.getClientsOfUser(userId);
    notification.id = ulid();
    notification.created_at = new Date();
    notification.read = false;
    notification.is_deleted = false;
    for (const clientId of clientIds) {
      const socket = UserService.socketclientsMap.get(clientId);
      socket?.emit('Notification', notification);
    }
  }

  updatenotifyUser(
    excludeId: string,
    userId: string,
    notification: Notification,
  ) {
    const clientIds = this.getClientsOfUser(userId);
    for (const clientId of clientIds) {
      if (clientId === excludeId) continue;
      const socket = UserService.socketclientsMap.get(clientId);
      socket?.emit('UpdateNotification', notification);
    }
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    return await this.prisma.user.create({ data });
  }
  async findAll(skip?: number, take?: number) {
    return await this.prisma.user.findMany({
      skip,
      take,
    });
  }
  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (err) {
      return null;
    }
  }
  async updateIsOnline(user_id: string, data: UpdateIsOnlineDto) {
    const user = await this.prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return await this.prisma.user.update({ where: { id: user_id }, data });
  }

  async updateIsInGame(user_id: string, data: UpdateIsInGameDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }
      return await this.prisma.user.update({ where: { id: user_id }, data });
    } catch (err) {}
  }

  async findOneByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }
  async findContainsUsername(username: string) {
    return await this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
    });
  }
  async update(
    user: User,
    data: UpdateUserDto,
    avatar: Express.Multer.File | undefined,
  ) {
    if (avatar && user.avatar !== 'default.png') {
		//console.log({user});
		
		//console.log(
		//	{
		//		pwd:process.cwd(), av: user.avatar
		//	}
		//);
		
      const filepath = join(process.cwd(), 'uploads', user.avatar);
      await unlinkAsync(filepath).catch(() => {
      });
    }
    //	data.email && data.username && avatar?.filename
    const user_c = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: data.email,
        username: data.username,
        avatar: avatar?.filename,
        is_profile_finished: true,
      },
    });
  
    if (user_c) {
      await this.channelMember.updateAllChannelMembersOfUser({
        channel_id: '',
        user_id: user_c.id,
        avatar: user_c.avatar,
        username: user_c.username,
        role: ChannelRole.MEMBER,
      });
      await this.channelMessage.updateAllMessagesOfUser({
        content: '',
        channel_id: '',
        avatar: user_c.avatar,
        username: user_c.username,
        sender_id: user_c.id,
      });
    }
    return user_c;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.prisma.user.delete({ where: { id } });
  }

  async getRelationships(id: string) {
    return await this.prisma.relationship.findMany({
      where: {
        OR: [{ user1_id: id }, { user2_id: id }],
      },
      include: {
        User1: true,
        User2: true,
      },
    });
  }
  async getRelationshipsByStatus(id: string, status: string) {
    return await this.prisma.relationship.findMany({
      where: {
        AND: [
          {
            OR: [{ user1_id: id }, { user2_id: id }],
          },
          { status: status as any },
        ],
      },
      include: {
        User1: true,
        User2: true,
      },
    });
  }

  async sendFriendRequest(user1_id: string, user2_id: string) {
    const relationship = await this.relationshipService.findByUsers(
      user1_id,
      user2_id,
    );

    if (relationship) {
      if (
        relationship.status === RelationshipStatus.PENDING ||
        relationship.status === RelationshipStatus.FRIEND
      ) {
        throw new ConflictException('Relationship already exists.');
      } else {
        throw new ConflictException('User has blocked you.');
      }
    }
    const inputData: CreateRelationshipDto = {
      user1_id,
      user2_id,
      status: RelationshipStatus.PENDING,
    };

    const relation2 = await this.relationshipService.create(inputData);
    this.notifyUser(user2_id, {
      type: 'FRIEND_REQUEST',
      User: await this.findOne(user1_id),
      relationship: relation2,
    });
    return relation2;
    //return await this.relationshipService.create(inputData);
  }
  async acceptFriendRequest(user1_id: string, user2_id: string) {
    const relationship = await this.relationshipService.findByUsers(
      user1_id,
      user2_id,
    );
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }
    if (relationship.status !== RelationshipStatus.PENDING) {
      throw new ConflictException('Relationship not pending');
    }
    if (relationship.user2_id !== user1_id) {
      throw new ConflictException('User not authorized');
    }
    const inputData: UpdateRelationshipDto = {
      status: RelationshipStatus.FRIEND,
      user1_id: user1_id,
      user2_id: user2_id,
    };
    const relation2 = await this.relationshipService.update(
      relationship.id,
      inputData,
    );
    this.notifyUser(user2_id, {
      type: 'FRIEND_REQUEST_ACCEPTED',
      User: await this.findOne(user1_id),
      relationship: relation2,
    });
    return relation2;
  }
  async rejectFriendRequest(user1_id: string, user2_id: string) {
    const relationship = await this.relationshipService.findByUsers(
      user1_id,
      user2_id,
    );
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }
    if (relationship.status !== RelationshipStatus.PENDING) {
      throw new ConflictException('Relationship not pending');
    }
    const relation2 = await this.relationshipService.remove(relationship.id);
    if (relationship.user1_id !== user1_id)
      this.notifyUser(user2_id, {
        type: 'FRIEND_REQUEST_REJECTED',
        User: await this.findOne(user1_id),
        relationship: relation2,
      });
    return relation2;
  }
  async unfriendUser(user1_id: string, user2_id: string) {
    const relationship = await this.relationshipService.findByUsers(
      user1_id,
      user2_id,
    );
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }
    if (relationship.status !== RelationshipStatus.FRIEND) {
      throw new ConflictException('Relationship not friend');
    }

    return await this.relationshipService.remove(relationship.id);
  }
  async cancelFriendRequest(user1_id: string, user2_id: string) {
    const relationship = await this.relationshipService.findByUsers(
      user1_id,
      user2_id,
    );
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }
    if (relationship.status !== RelationshipStatus.PENDING) {
      throw new ConflictException('Relationship not pending');
    }
    if (relationship.user1_id !== user1_id) {
      throw new ConflictException('User not authorized');
    }
    return await this.relationshipService.remove(relationship.id);
  }
  async blockUser(user1_id: string, user2_id: string) {
    const relationship = await this.relationshipService.findByUsers(
      user1_id,
      user2_id,
    );
    if (!relationship) {
      await this.relationshipService.create({
        user1_id,
        user2_id,
        status: RelationshipStatus.BLOCKED,
      });
    } else if (relationship.status === RelationshipStatus.BLOCKED) {
      throw new ConflictException('Relationship already blocked');
    } else {
      const inputData: UpdateRelationshipDto = {
        user1_id: user1_id,
        user2_id: user2_id,
        status: RelationshipStatus.BLOCKED,
      };
      const relation2 = await this.relationshipService.update(
        relationship.id,
        inputData,
      );
      this.notifyUser(user2_id, {
        type: 'BLOCKED',
        User: await this.findOne(user1_id),
        relationship: relation2,
      });
      return relation2;
    }
  }
  async unblockUser(user1_id: string, user2_id: string) {
    const relationship = await this.relationshipService.findByUsers(
      user1_id,
      user2_id,
    );
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }
    if (relationship.status !== RelationshipStatus.BLOCKED) {
      throw new ConflictException('Relationship not blocked');
    }
    if (relationship.user1_id !== user1_id) {
      throw new ConflictException('User not authorized');
    }
    const relation2 = await this.relationshipService.remove(relationship.id);
    this.notifyUser(user2_id, {
      type: 'UNBLOCKED',
      User: await this.findOne(user1_id),
      relationship: relation2,
    });
    return relation2;
  }
}
