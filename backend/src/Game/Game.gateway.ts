import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './Room.service';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './dto';
import { UpdateIsInGameDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/types/payload';
import { InviteService } from 'src/Invite/invite.service';
export let width_canvas: number = 800;
export let height_canvas: number = 450;

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/Game',
  credentials: true,
  transports: 'websocket',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly invite: InviteService,
  ) {}
  afterInit(server: any) {
    this.server = server;
  }

  async handleConnection(Player: Socket, ...args: any[]) {
    const cookies = cookie.parse(Player.handshake.headers.cookie || '');
    const accessToken = cookies['accessToken'];
    if (!accessToken) {
      Player.disconnect();
      return;
    }
    try {
      const payload = jwt.verify(
        accessToken,
        this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      ) as JwtPayload;
      const userId = payload.id;
      const mode = Player.handshake.query.mode as any;
      const id = Player.handshake.query.id as any;
      const role = Player.handshake.query.role as any;
      if (!mode || !userId || (mode && (mode != "classic" && mode != "power")))
      { 
        Player.disconnect();
        return;
      }
      if (this.roomService.isUserIdInAnyRoom(userId)) {
        this.server.to(Player.id).emit('game_over', 'exist');
        Player.disconnect();
        return;
      }
      if (mode && (id == "null" || role == "null")) 
            this.roomService.joinRoom(Player, mode, userId, id);
      else if (mode && id != "null" && role != "null")
      {
          const tab = await this.invite.findUnique(id);
          if (tab && ((role == "actor" && tab.actor_id == userId) ||
          (role == "target" && tab.target_id == userId) ))
            this.roomService.joinRoom(Player, tab.mode, userId, id);
          else 
          {
            Player.disconnect();
            return;
          }
      }
      else 
      {
        Player.disconnect();
        return;
      }
      const room = this.roomService.findRoomByPlayerSocket(Player.id);
      if (room && room.nbrplayer == 2)
      {
        const createGameData: CreateGameDto = {
          player1_id: room.player1.user_id,
          player2_id: room.player2.user_id,
          score1: 0,
          score2: 0,
        };
        const createdGame = await this.gameService.create(createGameData)
        if (createdGame)
          room.id = createdGame.id;
        const updateInGame: UpdateIsInGameDto = {
          is_in_game : true
        }
        await this.userService.updateIsInGame(room.player1.user_id, updateInGame);
        await this.userService.updateIsInGame(room.player2.user_id, updateInGame);
        if (role != 'null')
          await this.invite.RemoveInvite(room.id_invite, room.player1.user_id);
      }
    } catch (err) {
      Player.disconnect();
    }
  }

  async handleDisconnect(Player: Socket) {
    const room = this.roomService.findRoomByPlayerSocket(Player.id);
    let room_winner = null;
    if (room)
    {
      room.status = "close";
      if (room.player1 && room.player1.id_socket != Player.id) 
      {
        room.winner = room.player1;
        this.server.to(room.winner.id_socket).emit('game_over', 'You win');
        this.server.to(room?.player1.id_socket).emit('remove_room', room);
      } else if (room.player2 && room.player2.id_socket != Player.id) {
        room.winner = room.player2;
        this.server.to(room.winner.id_socket).emit('game_over', 'You win');
        this.server.to(room?.player2.id_socket).emit('remove_room', room);
      }
      if (room.winner)
        room_winner = room;
      this.roomService.removeRoom(room.id_room);
      if (room_winner) 
      {
        const UpdateGameData: UpdateGameDto = {
          winner_id: room_winner.winner.user_id,
          score1: room_winner.player1.score,
          score2: room_winner.player2.score,
        };
        const updateGame = await this.gameService.update(room_winner.id, UpdateGameData);
        const updateInGame: UpdateIsInGameDto = {
          is_in_game : false
        }
        await this.userService.updateIsInGame(room_winner.player1.user_id, updateInGame);
        await this.userService.updateIsInGame(room_winner.player2.user_id, updateInGame);
        await this.gameService.updateAchievements(room_winner.player1.user_id);
        await this.gameService.updateAchievements(room_winner.player2.user_id);
      }
    }
   }
  @SubscribeMessage("send_ball")
  async UpdateBall(@ConnectedSocket() socket:Socket){
    if (socket)
    {
      let room = this.roomService.findRoomByPlayerSocket(socket.id);
      let room_winner = null;
      if (room)
      {
        room.checkPaddle(socket, this.server);
        room.ball?.update();
        if (room.ball) {
          room.player1.score = room.ball.leftscore;
          room.player2.score = room.ball.rightscore;
          if (room.player1.score == 7) {
            room.winner = room.player1;
            room.status = 'win';
            this.server.to(room.player1.id_socket).emit('game_over', 'You win');
            this.server
              .to(room.player2.id_socket)
              .emit('game_over', 'You lose');
          } else if (room.player2.score == 7) {
            room.winner = room.player2;
            room.status = 'win';
            this.server.to(room.player2.id_socket).emit('game_over', 'You win');
            this.server
              .to(room.player1.id_socket)
              .emit('game_over', 'You lose');
          }
          this.server?.emit("update_ball", room);
          if (room.status == "win")
          {
            room_winner = room;
            this.roomService.removeRoom(room.id_room);
            if (room_winner) 
            {
              const UpdateGameData: UpdateGameDto = {
                winner_id: room_winner.winner.user_id,
                score1: room_winner.player1.score,
                score2: room_winner.player2.score,
              };
              const updateGame = await this.gameService.update(room_winner.id, UpdateGameData);
              const updateInGame: UpdateIsInGameDto = {
                is_in_game : false
              }
              await this.userService.updateIsInGame(room_winner.player1.user_id, updateInGame);
              await this.userService.updateIsInGame(room_winner.player2.user_id, updateInGame);
              await this.gameService.updateAchievements(room_winner.player1.user_id);
              await this.gameService.updateAchievements(room_winner.player2.user_id);
            }
          }
        }
      }
    }
  }
  @SubscribeMessage('move_paddle')
  movePaddle(@ConnectedSocket() socket: Socket, @MessageBody() key: string) {
    let room = this.roomService.findRoomByPlayerSocket(socket.id);
    if (room) {
      if (room.player1.id_socket == socket.id) room.player1.move(key);
      else if (room.player2.id_socket == socket.id) room.player2.move(key);
      this.server.emit('move_paddle', { room: room, id: socket.id });
    }
  }
  @SubscribeMessage('start_game')
  async startgame(@ConnectedSocket() socket: Socket) {
    await new Promise((res) => {setTimeout(res,4000)})
    const room = this.roomService.findRoomByPlayerSocket(socket.id);
      if (room)
      {
        room.countsockets++;
        if (room.countsockets == 2 && room.player1 && room.player2)
        {
          room.status = "start";
          this.server.to(room.player1.id_socket).emit('room_joined',room);
          this.server.to(room.player2.id_socket).emit('room_joined',room);
          
        }
      }
    }
  }

