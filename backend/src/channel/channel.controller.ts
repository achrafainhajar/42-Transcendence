import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import {
  ChannelRole,
  CreateChannelMemberDto,
  UpdateChannelMemberDto,
} from 'src/channel-member/dto';

@ApiTags('channels')
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  // @Get('/:id')
  // @ApiOperation({ summary: 'Get a channel by ID' })
  // @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  // @ApiResponse({ status: 200, description: 'Return the channel details.' })
  // async get(@Param('id') id: string) {
  //   return this.channelService.findOne(id);
  // }

  //   @Post('/')
  //   @ApiOperation({ summary: 'Create a new channel' })
  //   @ApiResponse({ status: 201, description: 'Channel successfully created.' })
  //   async create(@Body() data: any, user_id: string) {
  //     return this.channelService.create(data, user_id,ChannelRole.OWNER,null);
  //   }

  //   @Get('/')
  //   @ApiOperation({ summary: 'Get all channels' })
  //   @ApiResponse({ status: 200, description: 'Return all channels.' })
  //   async findAll() {
  //     return this.channelService.findAllNonDMChannels(null);
  //   }

  //   @Get('/:id')
  //   @ApiOperation({ summary: 'Get a channel by ID' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiResponse({ status: 200, description: 'Return the channel details.' })
  //   async get(@Param('id') id: string) {
  //     return this.channelService.findOne(id);
  //   }

  //   @Put('/:id')
  //   @ApiOperation({ summary: 'Update a channel by ID' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to update' })
  //   @ApiResponse({ status: 200, description: 'Return the updated channel.' })
  //   async update(@Param('id') id: string, @Body() data: any, user_id: string) {
  //     return this.channelService.update(id, data, user_id);
  //   }

  //   @Delete('/:id')
  //   @ApiOperation({ summary: 'Delete a channel by ID' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to delete' })
  //   @ApiResponse({ status: 200, description: 'Return the deleted channel.' })
  //   async remove(@Param('id') id: string, user_id: string) {
  //     return this.channelService.remove(id);
  //   }

  //   @Get('/:id/members')
  //   @ApiOperation({ summary: 'Get all members of a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiResponse({ status: 200, description: 'Return the channel members.' })
  //   async getMembers(@Param('id') id: string) {
  //     return this.channelService.getChannelMembers(id);
  //   }

  //   @Post('/:id/members')
  //   @ApiOperation({ summary: 'Add a member to a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiResponse({ status: 200, description: 'Return the channel members.' })
  //   async addMember(
  //     @Param('id') id: string,
  //     @Body() data: CreateChannelMemberDto,
  //   ) {
  //     return this.channelService.addMember(data);
  //   }

  //   @Get('/:id/members/:user_id')
  //   @ApiOperation({ summary: 'Get a member of a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiParam({ name: 'user_id', description: 'ID of the user to retrieve' })
  //   @ApiResponse({ status: 200, description: 'Return the channel member.' })
  //   async getMember(@Param('id') id: string, @Param('user_id') user_id: string) {
  //     return this.channelService.getMember(id, user_id);
  //   }

  //   @Put('/:id/members/:user_id')
  //   @ApiOperation({ summary: 'Update a member of a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiParam({ name: 'user_id', description: 'ID of the user to retrieve' })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Return the updated channel member.',
  //   })
  //   async updateMemberRole(
  //     @Param('id') id: string,
  //     @Param('user_id') user_id: string,
  //     @Body() data: UpdateChannelMemberDto,
  //   ) {
  //     return this.channelService.updateMemberRole(data);
  //   }

  //   @Delete('/:id/members/:user_id')
  //   @ApiOperation({ summary: 'Remove a member from a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiParam({ name: 'user_id', description: 'ID of the user to retrieve' })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Return the deleted channel member.',
  //   })
  //   async removeMember(
  //     @Param('id') id: string,
  //     @Param('user_id') user_id: string,
  //   ) {
  //     return this.channelService.removeMember(id, user_id);
  //   }

  //   @Get('/:id/messages')
  //   @ApiOperation({ summary: 'Get all messages of a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiResponse({ status: 200, description: 'Return the channel messages.' })
  //   async getMessages(@Param('id') id: string) {
  //     return this.channelService.getMessages(id);
  //   }

  //   @Post('/:id/messages')
  //   @ApiOperation({ summary: 'Add a message to a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiResponse({ status: 200, description: 'Return the channel messages.' })
  //   async addMessage(@Param('id') id: string, @Body() data: any) {
  //     return this.channelService.addMessage(id, data);
  //   }

  //   @Get('/:id/messages/:message_id')
  //   @ApiOperation({ summary: 'Get a message of a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiParam({
  //     name: 'message_id',
  //     description: 'ID of the message to retrieve',
  //   })
  //   @ApiResponse({ status: 200, description: 'Return the channel message.' })
  //   async getMessage(
  //     @Param('id') id: string,
  //     @Param('message_id') message_id: string,
  //   ) {
  //     return this.channelService.getMessage(id, message_id);
  //   }

  //   @Put('/:id/messages/:message_id')
  //   @ApiOperation({ summary: 'Update a message of a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiParam({
  //     name: 'message_id',
  //     description: 'ID of the message to retrieve',
  //   })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Return the updated channel message.',
  //   })
  //   async updateMessage(
  //     @Param('id') id: string,
  //     @Param('message_id') message_id: string,
  //     @Body() data: any,
  //   ) {
  //     return this.channelService.updateMessage(id, message_id, data);
  //   }

  //   @Delete('/:id/messages/:message_id')
  //   @ApiOperation({ summary: 'Remove a message from a channel' })
  //   @ApiParam({ name: 'id', description: 'ID of the channel to retrieve' })
  //   @ApiParam({
  //     name: 'message_id',
  //     description: 'ID of the message to retrieve',
  //   })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Return the deleted channel message.',
  //   })
  //   async removeMessage(
  //     @Param('id') id: string,
  //     @Param('message_id') message_id: string,
  //   ) {
  //     return this.channelService.removeMessage(id, message_id);
  //   }
}
