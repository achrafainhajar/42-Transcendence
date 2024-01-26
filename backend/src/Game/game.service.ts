import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto, UpdateGameDto } from './dto';
import { AchievementService } from 'src/achievement/achievement.service';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private achievementService: AchievementService,
  ) {}

  async create(data: CreateGameDto) {
    try {
      return await this.prisma.game.create({
        data,
      });
    } catch (err) {}
  }

  async findAll() {
    return await this.prisma.game.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prisma.game.findUnique({
        where: {
          id: id,
        },
      });
    } catch (err) {}
  }

  async update(id: string, data: UpdateGameDto) {
    try {
      return await this.prisma.game.update({
        where: { id },
        data,
      });
    } catch (err) {}
  }

  async remove(id: string) {
    return await this.prisma.game.delete({
      where: { id },
    });
  }

  async findByPlayer(user_id: string) {
    try {
      return await this.prisma.game.findMany({
        where: {
          OR: [
            {
              player1_id: user_id,
            },
            {
              player2_id: user_id,
            },
          ],
        },
        include: {
          Player1: true,
          Player2: true,
        },
      });
    } catch (err) {}
  }

  async checkAchievements(userAchievements: any, achievement: any) {
    try {
      const userAchievement = userAchievements.find(
        (userAchievement) => userAchievement.achievement_id === achievement.id,
      );
      return userAchievement;
    } catch (err) {
    }
  }

  async AddedAchievements(user_id: string, achievement_id: string) {
    try {
      await this.prisma.userAchievement.create({
        data: {
          user_id: user_id,
          achievement_id: achievement_id,
        },
      });
    } catch (err) {}
  }

  async updateAchievements(user_id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: user_id },
        include: { UserAchievements: true },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }
      const userAchievements = user.UserAchievements;

      const games = await this.findByPlayer(user_id);

      const achievements = await this.achievementService.findAll();

      const numberOfGames = games.length;
      const numberOfWins = games.filter((game) => {
        return game.winner_id === user_id;
      }).length;
      const numberOfLosses = numberOfGames - numberOfWins;

      for (const achievement of achievements) {
        if (achievement.name === 'First Game' && numberOfGames >= 1) {
          const userAchievement = await this.checkAchievements(
            userAchievements,
            achievement,
          );
          if (!userAchievement) {
            await this.AddedAchievements(user_id, achievement.id);
          }
        } else if (achievement.name === 'First Loss' && numberOfLosses >= 1) {
          const userAchievement = await this.checkAchievements(
            userAchievements,
            achievement,
          );
          if (!userAchievement) {
            await this.AddedAchievements(user_id, achievement.id);
          }
        } else if (
          (achievement.name.includes('Wins') ||
            achievement.name.includes('Win')) &&
          numberOfWins >= achievement.points
        ) {
          const userAchievement = await this.checkAchievements(
            userAchievements,
            achievement,
          );
          if (!userAchievement) {
            await this.AddedAchievements(user_id, achievement.id);
          }
        }
      }
    } catch (err) {
    }
  }
}
