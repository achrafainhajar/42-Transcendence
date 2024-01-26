import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto';
import { UserAchievementService } from 'src/user-achievement/user-achievement.service';

@Injectable()
export class AchievementService {
  constructor(
    private prisma: PrismaService,
    private userAchievementService: UserAchievementService,
  ) {}

  async findAll() {
    return await this.prisma.achievement.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.achievement.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data: CreateAchievementDto) {
    return await this.prisma.achievement.create({
      data,
    });
  }

  async update(id: string, data: UpdateAchievementDto) {
    return await this.prisma.achievement.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.achievement.delete({
      where: {
        id: id,
      },
    });
  }

  async getAchievementsByUserId(userId: string) {
    const userAchievements =
      await this.userAchievementService.findUserAchievements(userId);
    const achievements = await this.findAll();

    const achievementsById = achievements.reduce((acc, achievement) => {
      acc[achievement.id] = achievement;
      return acc;
    }, {});

    return userAchievements.map((userAchievement) => {
      return {
        ...userAchievement,
        achievements: achievementsById[userAchievement.achievement_id],
      };
    });
  }

  async addAchievementToUser(userId: string, achievementId: string) {
    const achievements = await this.getAchievementsByUserId(userId);
    const achievementIds = achievements.map(
      (achievement) => achievement.achievement_id,
    );
    if (achievementIds.includes(achievementId)) {
      throw new Error('Achievement already exists');
    }

    return await this.userAchievementService.create({
      user_id: userId,
      achievement_id: achievementId,
    });
  }
}
