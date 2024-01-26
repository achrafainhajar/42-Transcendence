import { Injectable } from '@nestjs/common';

@Injectable()
export class BallService {
  x: number;
  y: number;
  speed_x: number;
  speed_y: number;
  r: number;
  angle: number;
  width_canvas: number;
  height_canvas: number;
  l: number = 5;
  leftscore: number = 0;
  rightscore: number = 0;
  constructor(width: number, height: number) {
    this.r = 15;
    this.x = width / 2;
    this.y = height / 2;
    this.speed_x = 3;
    this.speed_y = 4;
    this.width_canvas = width;
    this.height_canvas = height;
    if (Math.random() * 1 < 0.5) this.speed_x *= -1;
  }
  reset() {
    this.x = this.width_canvas / 2;
    this.y = this.height_canvas / 2;
    if (Math.random() * 1 < 0.5) this.speed_x *= -1;
  }
  update() {
    this.x += this.speed_x;
    this.y += this.speed_y;
    if (this.y < 0 || this.y > this.height_canvas) this.speed_y *= -1;
    if (this.x - this.r > this.width_canvas) {
      this.leftscore++;
      this.reset();
    }
    if (this.x + this.r < 0) {
      this.rightscore++;
      this.reset();
    }
  }
}
