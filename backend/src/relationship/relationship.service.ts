import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateRelationshipDto,
  UpdateRelationshipDto,
} from './dto/relationship.dto';

@Injectable()
export class RelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  async isRelationshipDuplicate(
    user1_id: string,
    user2_id: string,
  ): Promise<boolean> {
    const existingRelation = await this.prisma.relationship.findFirst({
      where: {
        OR: [
          {
            user1_id: user1_id,
            user2_id: user2_id,
          },
          {
            user1_id: user2_id,
            user2_id: user1_id,
          },
        ],
      },
    });
    return !!existingRelation;
  }

  async create(data: CreateRelationshipDto) {
    const isDuplicate = await this.isRelationshipDuplicate(
      data.user1_id,
      data.user2_id,
    );
    if (isDuplicate) {
      throw new ConflictException('Relationship already exists.');
    }
    const inputData: CreateRelationshipDto = {
      user1_id: data.user1_id,
      user2_id: data.user2_id,
      status: data.status as any,
    };

    return await this.prisma.relationship.create({ data: inputData });
  }

  async findAll() {
    const relationships = await this.prisma.relationship.findMany({
      include: {
        User1: true,
        User2: true,
      },
    });
    return relationships;
  }

  async findOne(id: string) {
    return await this.prisma.relationship.findUnique({
      where: { id },
      include: {
        User1: true,
        User2: true,
      },
    });
  }

  async findByUsers(user1_id: string, user2_id: string) {
    try {
      return await this.prisma.relationship.findFirst({
        where: {
          OR: [
            {
              user1_id: user1_id,
              user2_id: user2_id,
            },
            {
              user1_id: user2_id,
              user2_id: user1_id,
            },
          ],
        },
        include: {
          User1: true,
          User2: true,
        },
      });
    } catch {
      return null;
    }
  }

  async update(id: string, data: UpdateRelationshipDto) {
    const relationship = await this.prisma.relationship.findUnique({
      where: { id },
    });
    if (!relationship) {
      throw new NotFoundException(`Relationship with ID ${id} not found`);
    }
    const inputData: UpdateRelationshipDto = {
      status: data.status as any,
      user1_id: data.user1_id,
      user2_id: data.user2_id,
    };
    return await this.prisma.relationship.update({
      where: { id },
      data: inputData,
    });
  }

  async remove(id: string) {
    const relationship = await this.prisma.relationship.findUnique({
      where: { id },
    });
    if (!relationship) {
      throw new NotFoundException(`Relationship with ID ${id} not found`);
    }
    return await this.prisma.relationship.delete({ where: { id } });
  }
}
