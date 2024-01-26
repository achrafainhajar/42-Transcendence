import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChannelGateway } from 'src/channel/channel.gateway';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UserService } from 'src/user/user.service';

export const GetCurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    //return data ? user?.[data] : user;
    return user;
  },
);

export const GetCurrentSocketUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client: Socket = ctx.switchToWs().getClient();

    //const moduleRef = ctx.get(ModuleRef);
    //const userService = await moduleRef.resolve(UserService);

    // Call a method in UserService using the WebSocket client

    // Call a method in UserService and return its result
    //return userService.getUserOfClient(client.id);
    return 'ad';
  },
);
