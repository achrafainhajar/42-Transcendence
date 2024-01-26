
import { Paddle } from "./Paddle";
import { Ball } from "./Ball";
import { Socket } from "socket.io-client";

export class Room{
  id_room: number;
  status : string = "wait";
  player1: Paddle | null = null;
  player2: Paddle | null = null;
  winner : Paddle | null = null;
  ball : Ball | null = null;
  mode : string;
  constructor(id_room : number, mode :string)
  {
    this.id_room = id_room;
    this.mode = mode;
  }
  remove_room(socket: Socket){
      socket?.disconnect();
        if (this.player1)
          this.player1 = null;
        if (this.player2)
          this.player2 = null;
}
}