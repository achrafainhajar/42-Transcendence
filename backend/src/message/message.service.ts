import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async updateAllMessagesOfUser(updateData: CreateMessageDto) {
    try {
      const { username, sender_id, avatar } = updateData;
      await this.prisma.message.updateMany({
        where: {
          sender_id: sender_id,
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
  async create(data: CreateMessageDto) {
    return await this.prisma.message.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.message.findMany();
  }

  async findOne(id: string, user1_id: string) {
    try {
      return await this.prisma.message.findMany({
        where: {
          channel_id: id,
          AND: [
            {
              Sender: {
                relationships1: {
                  none: {
                    AND: [
                      { user2_id: user1_id },
                      { status: 'blocked' },
                    ],
                  },
                },
              },
            },
            {
              Sender: {
                relationships2: {
                  none: {
                    AND: [
                      { user1_id: user1_id },
                      { status: 'blocked' },
                    ],
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          created_at: 'asc',
        },
        include: {
          Sender: true,
        },
      });
    } catch{
    }
  }
  

  async update(id: string, data: any) {
    return await this.prisma.message.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.message.delete({
      where: { id },
    });
  }
  async removeall(channel_id: string) {
    try {
      await this.prisma.message.deleteMany({
        where: { channel_id: channel_id },
      });
    } catch {}
  }
}
