import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import p5Types from "p5";
import {room} from "./Game";
import { width_canvas, height_canvas } from "./Game";
import { canvasX, canvasY } from "./Game";
import pathplayer1 from "../../../assets/GameImages/player1.png"
import pathplayer2 from "../../../assets/GameImages/player2.png"

let AvatarCanvas : any;
let imageSize : number;
let avatar1: p5Types.Image;
let avatar2: p5Types.Image;
const sketch: Sketch = (p5: P5CanvasInstance) => {
  avatar1 =  p5.loadImage(pathplayer1);
  avatar2 =  p5.loadImage(pathplayer2);
  p5.setup = () => {
      createCanvas();
  };
  const createCanvas = () => {
    const scoreCanvasHeight = height_canvas * 0.1;
    const avatarCanvasHeight = height_canvas * 0.4;
    if (AvatarCanvas) {
      AvatarCanvas.remove();
    }
    AvatarCanvas = p5.createCanvas(width_canvas, avatarCanvasHeight);
    const scoreCanvasY = canvasY - scoreCanvasHeight;
    const avatarCanvasY =  scoreCanvasY - avatarCanvasHeight ;
    AvatarCanvas.position(canvasX, avatarCanvasY);
    imageSize = avatarCanvasHeight * 0.7; 
  };
  p5.windowResized = () => {
    const scoreCanvasHeight = height_canvas * 0.1;
    const avatarCanvasHeight = height_canvas * 0.3;
    p5.resizeCanvas(width_canvas, avatarCanvasHeight);
    const scoreCanvasY = canvasY - scoreCanvasHeight;
    const avatarCanvasY =  scoreCanvasY - avatarCanvasHeight;
    AvatarCanvas.position(canvasX, avatarCanvasY);
    imageSize = avatarCanvasHeight * 0.7; 
    createCanvas(); 
  };

  p5.draw = () => {
    if (room && room?.status == "start") {
      AvatarCanvas.clear();
      const player1ScoreX = 0  ;
      const player1ScoreY = AvatarCanvas.height - imageSize;
      const player2ScoreX = AvatarCanvas.width - imageSize  *0.9;
      const player2ScoreY = AvatarCanvas.height - imageSize;
      
      if (room.player1)
      {
        p5.image(avatar1, player1ScoreX, player1ScoreY, imageSize, imageSize);
      }
      if (room.player2)
      {
        p5.image(avatar2, player2ScoreX, player2ScoreY, imageSize, imageSize);
      }
    }
    else
      AvatarCanvas.clear();
  };

};
export default function AvatarBoard() {
  
  return(
    <ReactP5Wrapper sketch={sketch} />
  )
}