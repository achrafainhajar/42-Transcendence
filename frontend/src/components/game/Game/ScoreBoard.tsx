import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import p5Types from "p5";
import {room} from "./Game";
import { width_canvas, height_canvas } from "./Game";
import { canvasX, canvasY } from "./Game";
import img1 from "../../../assets/GameImages/ball1.png";
import img2 from "../../../assets/GameImages/ball2.png";
import img3 from "../../../assets/GameImages/ball3.png";
import img4 from "../../../assets/GameImages/ball4.png";
import img5 from "../../../assets/GameImages/ball5.png";
import img6 from "../../../assets/GameImages/ball6.png";
import img7 from "../../../assets/GameImages/ball7.png";

let scoreCanvas : any;
let ball1 : p5Types.Image;
let ball2 : p5Types.Image;
let ball3 : p5Types.Image;
let ball4 : p5Types.Image;
let ball5 : p5Types.Image;
let ball6 : p5Types.Image;
let ball7 : p5Types.Image;
let imageSize : number;
const sketch: Sketch = (p5: P5CanvasInstance) => {
  ball1 = p5.loadImage(img1);
  ball2 = p5.loadImage(img2);
  ball3 = p5.loadImage(img3);
  ball4 = p5.loadImage(img4);
  ball5 = p5.loadImage(img5);
  ball6 = p5.loadImage(img6);
  ball7 = p5.loadImage(img7);
  p5.setup = () => {
      createCanvas();
  };
  const createCanvas = () => {
    const scoreCanvasHeight = height_canvas * 0.1;
    if (scoreCanvas) {
      scoreCanvas.remove();
    }
    scoreCanvas = p5.createCanvas(width_canvas, scoreCanvasHeight);
    const scoreCanvasY = canvasY - scoreCanvasHeight;
    scoreCanvas.position(canvasX, scoreCanvasY);
     imageSize = scoreCanvasHeight * 0.7;  
  };
  p5.windowResized = () => {
    const scoreCanvasHeight = height_canvas * 0.1;
    p5.resizeCanvas(width_canvas, scoreCanvasHeight);
    const scoreCanvasY = canvasY - scoreCanvasHeight;
    scoreCanvas.position(canvasX, scoreCanvasY);
    imageSize = scoreCanvasHeight * 0.7;   
    createCanvas(); 
  };

  p5.draw = () => {
    if (room && room?.status == "start") {
      const player1ScoreX = width_canvas / 4 - imageSize / 2;
      const player1ScoreY = scoreCanvas.height / 2 - imageSize / 2;
      if (room.player1) {
        if (room.player1.score == 1)
          p5.image(ball1, player1ScoreX, player1ScoreY, imageSize, imageSize);
        else if (room.player1.score == 2)
          p5.image(ball2, player1ScoreX, player1ScoreY, imageSize, imageSize);
        else if (room.player1.score == 3)
          p5.image(ball3, player1ScoreX, player1ScoreY, imageSize, imageSize);
        else if (room.player1.score == 4)
          p5.image(ball4, player1ScoreX, player1ScoreY, imageSize, imageSize);
        else if (room.player1.score == 5)
          p5.image(ball5, player1ScoreX, player1ScoreY, imageSize, imageSize);
        else if (room.player1.score == 6)
          p5.image(ball6, player1ScoreX, player1ScoreY, imageSize, imageSize);
        else if (room.player1.score == 7)
          p5.image(ball7, player1ScoreX, player1ScoreY, imageSize, imageSize);
      }
      const player2ScoreX = (width_canvas / 4) * 3 - imageSize / 2;
      const player2ScoreY = scoreCanvas.height / 2 - imageSize / 2;
      if (room.player2) {
        if (room.player2.score == 1)
          p5.image(ball1, player2ScoreX, player2ScoreY, imageSize, imageSize);
        else if (room.player2.score == 2)
          p5.image(ball2, player2ScoreX, player2ScoreY, imageSize, imageSize);
        else if (room.player2.score == 3)
          p5.image(ball3, player2ScoreX, player2ScoreY, imageSize, imageSize);
        else if (room.player2.score == 4)
          p5.image(ball4, player2ScoreX, player2ScoreY, imageSize, imageSize);
        else if (room.player2.score == 5)
          p5.image(ball5, player2ScoreX, player2ScoreY, imageSize, imageSize);
        else if (room.player2.score == 6)
          p5.image(ball6, player2ScoreX, player2ScoreY, imageSize, imageSize);
        else if (room.player2.score == 7)
          p5.image(ball7, player2ScoreX, player2ScoreY, imageSize, imageSize);
      }
    }
    else
      scoreCanvas.clear();
  };

};
export default function ScoreBoard() {
  
  return(
    <ReactP5Wrapper sketch={sketch} />
  )
}