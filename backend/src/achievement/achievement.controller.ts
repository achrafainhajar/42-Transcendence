import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAccessTokenGuard } from 'src/auth/guards/jwt-access-token.guard';
import { GetCurrentUser } from 'src/common/getCurrentUser';
import { User } from '@prisma/client';

@ApiTags('achievements')
@Controller('achievement')
export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  @Get('/')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiResponse({ status: 200, description: 'Return all achievements.' })
  async findAll() {
    return await this.achievementService.findAll();
  }

  @Get('/user/:id')
  @UseGuards(JWTAccessTokenGuard)
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiOperation({ summary: 'Get all achievements of a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all achievements of a user.',
  })
  async getAchievementsByUserId(@Param('id') id: string) {
    return await this.achievementService.getAchievementsByUserId(id);
  }

  @Get('/:id')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get an achievement by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the achievement details.',
  })
  async get(@Param('id') id: string) {
    return await this.achievementService.findOne(id);
  }
}
