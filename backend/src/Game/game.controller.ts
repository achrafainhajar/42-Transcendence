import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { JWTAccessTokenGuard } from 'src/auth/guards/jwt-access-token.guard';
import { GetCurrentUser } from 'src/common/getCurrentUser';
import { User } from '@prisma/client';

@ApiTags('games')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('/')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({ status: 200, description: 'Return all games.' })
  async findAll() {
    return await this.gameService.findAll();
  }

  @Get('/player/:id')
  @UseGuards(JWTAccessTokenGuard)
  @ApiParam({ name: 'id', description: 'ID of the player to retrieve' })
  @ApiOperation({ summary: 'Get a game by player ID' })
  @ApiResponse({ status: 200, description: 'Return the game details.' })
  async getByPlayer(@Param('id') id: string) {
    return await this.gameService.findByPlayer(id);
  }

  @Get('/:id')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get a game by ID' })
  @ApiResponse({ status: 200, description: 'Return the game details.' })
  async get(@Param('id') id: string) {
    return await this.gameService.findOne(id);
  }
}
