import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PaddleService } from './Paddle.service';
import { width_canvas, height_canvas } from './Game.gateway';
import { BallService } from './Ball.service';

@Injectable()
export class RoomService {
  rooms: Room[] = [];
  roomIdCounter = 1;
  joinRoom(socket: Socket, mode: string, userId: string, id: string) {
    let room: Room | undefined;
    for (const r of this.rooms) {
      if (r.nbrplayer < 2 && r.mode == mode && r.id_invite == id) {
        room = r;
        break;
      }
    }
    if (!room) {
      room = new Room(this.roomIdCounter++, mode, id);
      this.rooms.push(room);
    }
    room.addPlayer(socket, userId);
  }
  findRoomByPlayerSocket(socketid: string): Room | undefined {
    for (const room of this.rooms) {
      if (
        room.player1?.id_socket === socketid ||
        room.player2?.id_socket === socketid
      ) {
        return room;
      }
    }
    return undefined;
  }
  removeRoom(roomId: number) {
    const index = this.rooms.findIndex((room) => room.id_room === roomId);
    if (index !== -1) {
      this.rooms.splice(index, 1);
    }
  }
  isUserIdInAnyRoom(userId: string): boolean {
    for (const room of this.rooms) {
      if (room.hasUser(userId)) {
        return true;
      }
    }
    return false;
  }
}

class Room {
  id: string;
  id_room: number;
  id_invite : string;
  player1: PaddleService = null;
  player2: PaddleService = null;
  winner: PaddleService = null;
  ball: BallService = null;
  nbrplayer: number = 0;
  status: string = 'wait';
  width_canvas: number;
  height_canvas: number;
  countsockets: number = 0;
  mode: string;
  constructor(id_room: number, mode: string, id: string) {
    this.id_invite = id;
    this.id_room = id_room;
    this.mode = mode;
    this.width_canvas = width_canvas;
    this.height_canvas = height_canvas;
  }
  hasUser(userId: string): boolean {
    return (
      (this.player1 && this.player1.user_id === userId) ||
      (this.player2 && this.player2.user_id === userId)
    );
  }
  addPlayer(socket: Socket, userId: string) {
    if (this.nbrplayer === 0) {
      this.player1 = new PaddleService(socket.id, 'left', userId);
      this.nbrplayer++;
    } else if (this.nbrplayer === 1) {
      this.player2 = new PaddleService(socket.id, 'right', userId);
      this.nbrplayer++;
      this.ball = new BallService(this.width_canvas, this.height_canvas);
    }
  }
  checkPaddle(socket: Socket, server: Server) {
    if (this.ball && this.player1 && this.player1.id_socket == socket.id) {
      if (
        this.ball.y < this.player1.y + this.player1.height / 2 + 15 &&
        this.ball.y > this.player1.y - this.player1.height / 2 - 15 &&
        this.ball.x - this.ball.r < this.player1.x + this.player1.width / 2
      )
        if (this.ball.x > this.player1.x) {
          this.ball.x += 4;
          this.ball.speed_x *= -1;
          if (this.player1.power == 'on') {
            this.player1.height = 95;
            this.player1.power = 'off';
            this.player1.y = this.height_canvas / 2;
            server.emit('move_paddle', {
              room: this,
              id: socket.id,
            });
          }
        }
    }
    if (this.ball && this.player2 && this.player2.id_socket == socket.id) {
      if (
        this.ball.y < this.player2.y + this.player2.height / 2 + 15 &&
        this.ball.y > this.player2.y - this.player2.height / 2 - 15 &&
        this.ball.x + this.ball.r > this.player2.x - this.player2.width / 2
      )
        if (this.ball.x < this.player2.x) {
          this.ball.x -= 4;
          this.ball.speed_x *= -1;
          if (this.player2.power == 'on') {
            this.player2.height = 95;
            this.player2.power = 'off';
            this.player2.y = this.height_canvas / 2;
            server.emit('move_paddle', {
              room: this,
              id: socket.id,
            });
          }
        }
    }
  }
}
