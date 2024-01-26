import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  BadRequestException,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { GetCurrentUser } from '../common/getCurrentUser';
import { User } from '@prisma/client';
import { JWTAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //   @Post()
  //   @ApiOperation({ summary: 'Create a new user' })
  //   @ApiResponse({ status: 201, description: 'User successfully created.' })
  //   async create(@Body() createUserDto: CreateUserDto) {
  //     return this.userService.create(createUserDto);
  //   }

  @Get('username/:username')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get a user by username' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to retrieve',
  })
  @ApiResponse({ status: 200, description: 'Return the user details.' })
  async getByUsername(@Param('username') username: string) {
    return await this.userService.findOneByUsername(username);
  }

  @Get('search/:username')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Search for users by username' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to retrieve',
  })
  @ApiResponse({ status: 200, description: 'Return the user details.' })
  async searchByUsername(@Param('username') username: string) {
    return await this.userService.findContainsUsername(username);
  }

  @Get()
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of entries to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of entries to take',
  })
  @ApiResponse({ status: 200, description: 'Return a list of users.' })
  async getAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return await this.userService.findAll(skip, take);
  }

  @Put('')
  @UseGuards(AuthGuard('jwt-access-token'))
  @UseInterceptors(
    FileInterceptor('avatar_url', {
      fileFilter: (req: Request, file, cb) => {
        req.body.rejectImageType = false;
        req.body.rejectImageSize = false;
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          req.body.rejectImageType = true;
          return cb(null, false);
        }
        // check size 1024 * 1024 * 2
        if (file.size > 1024 * 1024 * 2) {
          req.body.rejectImageSize = true;
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  async update(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    avatar: Express.Multer.File | undefined,
    @Body()
    updateUserDto: UpdateUserDto,
    @GetCurrentUser() user: User,
  ) {
    //updateUserDto = updateUserDto as UpdateUserDto & {
    //  rejectImageType: boolean;
    //  rejectImageSize: boolean;
    //};
    if (updateUserDto.rejectImageType)
      throw new BadRequestException('avatar uploaded is not an image');
    if (updateUserDto.rejectImageSize)
      throw new BadRequestException('avatar uploaded is too large (2MB)');
    return await this.userService.update(user, updateUserDto, avatar);
  }

  //   @Delete(':id')
  //   @ApiOperation({ summary: 'Delete a user' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  //   @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  //   async remove(@Param('id') id: string): Promise<void> {
  //     return this.userService.remove(id);
  //   }

  @Get('/relationships')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get all relationships for a user' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of relationships for the user.',
  })
  async getRelationships(@GetCurrentUser() user: User) {
    return await this.userService.getRelationships(user.id);
  }

  @Get('/relationships/status/:status')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get all relationships for a user by status' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiParam({
    name: 'status',
    description: 'Status of the relationships to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a list of relationships for the user.',
  })
  async getRelationshipsByStatus(
    @GetCurrentUser() user: User,
    @Param('status') status: string,
  ) {
    return await this.userService.getRelationshipsByStatus(user.id, status);
  }

  @Post('/relationships/:user2_id/sendFriendRequest')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Send a friend request to a user' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to send request from' })
  @ApiParam({
    name: 'user2_id',
    description: 'ID of the user to send request to',
  })
  @ApiResponse({
    status: 201,
    description: 'Return a list of relationships for the user.',
  })
  async sendFriendRequest(
    @GetCurrentUser() user: User,
    @Param('user2_id') user2_id: string,
  ) {
    return await this.userService.sendFriendRequest(user.id, user2_id);
  }

  @Put('/relationships/:user2_id/acceptFriendRequest')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Accept a friend request from a user' })
  //   @ApiParam({
  //     name: 'id',
  //     description: 'ID of the user to accept request from',
  //   })
  @ApiParam({
    name: 'user2_id',
    description: 'ID of the user to accept request from',
  })
  @ApiResponse({
    status: 201,
    description: 'Return a list of relationships for the user.',
  })
  async acceptFriendRequest(
    @GetCurrentUser() user: User,
    @Param('user2_id') user2_id: string,
  ) {
    return await this.userService.acceptFriendRequest(user.id, user2_id);
  }
  @Delete('/relationships/:user2_id/rejectFriendRequest')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Reject a friend request from a user' })
  //   @ApiParam({
  //     name: 'id',
  //     description: 'ID of the user to reject request from',
  //   })
  @ApiParam({
    name: 'user2_id',
    description: 'ID of the user to reject request from',
  })
  @ApiResponse({
    status: 201,
    description: 'Return a list of relationships for the user.',
  })
  async rejectFriendRequest(
    @GetCurrentUser() user: User,
    @Param('user2_id') user2_id: string,
  ) {
    return await this.userService.rejectFriendRequest(user.id, user2_id);
  }
  @Put('/relationships/:user2_id/blockUser')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Block a user' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to block' })
  @ApiParam({ name: 'user2_id', description: 'ID of the user to block' })
  @ApiResponse({
    status: 201,
    description: 'Return a list of relationships for the user.',
  })
  async blockUser(
    @GetCurrentUser() user: User,
    @Param('user2_id') user2_id: string,
  ) {
    return await this.userService.blockUser(user.id, user2_id);
  }
  @Delete('/relationships/:user2_id/unblockUser')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Unblock a user' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to unblock' })
  @ApiParam({ name: 'user2_id', description: 'ID of the user to unblock' })
  @ApiResponse({
    status: 201,
    description: 'Return a list of relationships for the user.',
  })
  async unblockUser(
    @GetCurrentUser() user: User,
    @Param('user2_id') user2_id: string,
  ) {
    return await this.userService.unblockUser(user.id, user2_id);
  }

  @Delete('/relationships/:user2_id/unfriendUser')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Unfriend a user' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to unfriend' })
  @ApiParam({ name: 'user2_id', description: 'ID of the user to unfriend' })
  @ApiResponse({
    status: 201,
    description: 'Return a list of relationships for the user.',
  })
  async unfriendUser(
    @GetCurrentUser() user: User,
    @Param('user2_id') user2_id: string,
  ) {
    return await this.userService.unfriendUser(user.id, user2_id);
  }

  @Delete('/relationships/:user2_id/cancelFriendRequest')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Cancel a friend request to a user' })
  //   @ApiParam({ name: 'id', description: 'ID of the user to cancel request from' })
  @ApiParam({
    name: 'user2_id',
    description: 'ID of the user to cancel request to',
  })
  @ApiResponse({
    status: 204,
    description: 'Return a list of relationships for the user.',
  })
  async cancelFriendRequest(
    @GetCurrentUser() user: User,
    @Param('user2_id') user2_id: string,
  ) {
    return await this.userService.cancelFriendRequest(user.id, user2_id);
  }

  @Get(':id')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the user details.' })
  async get(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
