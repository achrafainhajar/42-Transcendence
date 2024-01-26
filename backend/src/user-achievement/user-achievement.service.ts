import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserAchievementDto } from './dto';

@Injectable()
export class UserAchievementService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.userAchievement.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.userAchievement.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data: CreateUserAchievementDto) {
    return await this.prisma.userAchievement.create({
      data,
    });
  }

  async findUserAchievements(userId: string) {
    return await this.prisma.userAchievement.findMany({
      where: {
        user_id: userId,
      },
    });
  }
}
