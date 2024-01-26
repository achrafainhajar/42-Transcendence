import { Injectable } from '@nestjs/common';
import { width_canvas, height_canvas } from './Game.gateway';
@Injectable()
export class PaddleService {
  id_socket: string;
  user_id: string;
  direction: string;
  x: number;
  y: number;
  width: number;
  height: number;
  power: string;
  prev_y: number;
  score: number;
  steps: number;
  constructor(socket_id: string, dir: string, user_id: string) {
    this.id_socket = socket_id;
    this.user_id = user_id;
    this.direction = dir;
    this.width = 20;
    this.height = 95;
    if (dir == 'left') {
      this.x = this.width;
      this.y = height_canvas / 2;
    } else if (dir == 'right') {
      this.x = width_canvas - this.width;
      this.y = height_canvas / 2;
    }
    this.power = 'wait';
    this.steps = 10;
    this.score = 0;
  }
  update_paddle(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  constrain(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
  move(key: string) {
    if (key === 'down') {
      this.y += this.steps;
      if (this.y < this.height / 2) {
        this.y = this.height / 2;
      } else if (this.y > height_canvas - this.height / 2) {
        this.y = height_canvas - this.height / 2;
      }
    } else if (key === 'up') {
      this.y -= this.steps;
      if (this.y < this.height / 2) {
        this.y = this.height / 2;
      } else if (this.y > height_canvas - this.height / 2) {
        this.y = height_canvas - this.height / 2;
      }
    } else if (key === 'p' && this.power === 'wait') {
      this.y = height_canvas / 2;
      this.height = height_canvas;
      this.power = 'on';
    }
  }  
}
