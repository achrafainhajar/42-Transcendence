import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { OnModuleInit } from '@nestjs/common';
import { instrument } from '@socket.io/admin-ui';
import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth/types/payload';
import { UserService } from '../user/user.service';
import { BaseGateway } from 'src/channel/base.gateway';
import { GetCurrentSocketUser } from 'src/common/getCurrentUser';

@WebSocketGateway(undefined, {
  cors: '*',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnModuleInit
{
  @WebSocketServer()
  protected server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}

  afterInit() {
  }

  onModuleInit() {
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
  }

  handleDisconnect(client: Socket) {
    this.userService.removeClientSocket(client.id);
  }

  async handleConnection(client: Socket) {

    const cookies = cookie.parse(client.handshake.headers.cookie || '');

    const accessToken = cookies['accessToken'];

    if (!accessToken) {
      client.disconnect();
      return;
    }

    try {
      const payload = jwt.verify(
        accessToken,
        this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      ) as JwtPayload;
      const userId = payload.id;

      this.userService.addClientToUser(userId, client.id);
      this.userService.addClientSocket(client);
    } catch (err) {

      this.userService.removeClientSocket(client.id);
      client.disconnect();
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @GetCurrentSocketUser() ss,
    client: Socket,
    payload: any,
  ) {

    const { chatId, text, userId } = payload;
    //const message = await this.chatService.createMessage({
    //	chatId,
    //	text,
    //	userId
    //});

    const all = this.userService.getAllConnectedUsers();
    const user = await this.userService.getUserOfClient(client.id);
    const clients = this.userService.getClientsOfUser(user.id);

    this.server.to(chatId).emit('message', {
      user,
      text,
      chatId,
    });
    client.emit('message', {
      user,
      text,
      chatId,
    });
  }
}
