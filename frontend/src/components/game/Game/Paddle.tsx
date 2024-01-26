import p5Types from "p5";
import { Socket } from "socket.io-client";
import imgPath from "../../../assets/GameImages/paddle.png";
export class Paddle{
    public p5obj : p5Types;
    public id_socket : string;
    public x : number;
    public y : number;
    public width : number;
    public height : number
    public direction : string;
    public score : number;
    public power : string;
    public width_canvas: number;
    public height_canvas: number;
    public img : p5Types.Image;
    constructor(p5obj: p5Types,data: any, prev_width: number, prev_height: number, width_canvas: number, height_canvas: number){
        this.p5obj = p5obj
        this.id_socket = data.id_socket;
        this.width_canvas = width_canvas;
        this.height_canvas = height_canvas;
        this.width = data.width * this.width_canvas / prev_width
        this.height = data.height * this.height_canvas / prev_height
        this.direction = data.direction;
        this.power = data.power;
        
        this.x =  data.x *this.width_canvas / prev_width;
        this.y = data.y * this.height_canvas / prev_height;
        this.score = data.score;
        this.img = this.p5obj.loadImage(imgPath);
    }
    resize(prev_height : number, prev_width : number)
    {
      this.x *= this.p5obj.width / prev_width;
      this.y *= this.p5obj.height / prev_height;
      this.width *= this.p5obj.width / prev_width;
      this.height *= this.p5obj.height / prev_height;
      this.width_canvas = this.p5obj.width;
      this.height_canvas = this.p5obj.height;
    }
    show(){
         this.p5obj.fill(0);
         const imageX = this.x - this.width / 2;
         const imageY = this.y - this.height / 2;
         this.p5obj.image(this.img, imageX, imageY, this.width, this.height);
    }
    move (socket : Socket, mode : string){
        if (this.p5obj.keyIsPressed && this.id_socket == socket.id){
          if (this.p5obj.keyCode === (this.p5obj.DOWN_ARROW))
            socket?.emit("move_paddle", "down");
          else if (this.p5obj.keyCode === (this.p5obj.UP_ARROW))
            socket?.emit("move_paddle", "up");
          else if (this.p5obj.key == 'p' && this.power == "wait" && mode ==  "power")
            socket?.emit("move_paddle", "p");
        }
      }
}