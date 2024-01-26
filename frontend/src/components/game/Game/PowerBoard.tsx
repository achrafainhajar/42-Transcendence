import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import p5Types from "p5";
import {room} from "./Game";
import { width_canvas, height_canvas } from "./Game";
import { canvasX, canvasY } from "./Game";
import pathoffleft from "../../../assets/GameImages/PowerOffLeft.png";
import pathoffright  from "../../../assets/GameImages/PowerOffRight.png";
import pathonleft from "../../../assets/GameImages/power_player1.png";
import pathonright from "../../../assets/GameImages/power_player2.png";

let powerCanvas : any;
let imgoffleft : p5Types.Image;
let imgoffright : p5Types.Image;
let imgonleft : p5Types.Image;
let imgonright : p5Types.Image;
let imageSize : number;
const sketch: Sketch = (p5: P5CanvasInstance) => {

  imgoffleft = p5.loadImage(pathoffleft);
  imgoffright = p5.loadImage(pathoffright);
  imgonleft = p5.loadImage(pathonleft);
  imgonright = p5.loadImage(pathonright);
  p5.setup = () => {
      createCanvas();
  };
  const createCanvas = () => {
    const powerCanvasHeight = height_canvas * 0.2;
    if (powerCanvas) {
      powerCanvas.remove();
    }
    powerCanvas = p5.createCanvas(width_canvas, powerCanvasHeight);
    const scoreCanvasY = canvasY + height_canvas;
    powerCanvas.position(canvasX, scoreCanvasY);
     imageSize = powerCanvasHeight * 1.2;  
     
  };
  p5.windowResized = () => {
    const powerCanvasHeight = height_canvas * 0.2;
    p5.resizeCanvas(width_canvas, powerCanvasHeight);
    const powerCanvasY = canvasY + powerCanvasHeight;
    powerCanvas.position(canvasX, powerCanvasY);
    imageSize = powerCanvasHeight * 1.2;   
    createCanvas(); 
  };

  p5.draw = () => {
    powerCanvas.clear();
    if (room?.status == "start" && room.mode == "power") {
        const player1ScoreX = 0;
        const player1ScoreY = 0 - imageSize / 4;
        const player2ScoreX = width_canvas - imageSize ;
        const player2ScoreY = 0 - imageSize / 4;
        powerCanvas.clear();
        if (room.player1) {
          if (room.player1.power == "wait" || room.player1.power == "off")
            p5.image(imgoffleft, player1ScoreX, player1ScoreY, imageSize, imageSize);
          else if (room.player1.power == "on")
            p5.image(imgonleft, player1ScoreX, player1ScoreY, imageSize, imageSize);
        }
    
        if (room.player2) {
          if (room.player2.power == "wait" || room.player2.power == "off")
            p5.image(imgoffright, player2ScoreX, player2ScoreY, imageSize, imageSize);
          else if (room.player2.power == "on")
            p5.image(imgonright, player2ScoreX, player2ScoreY, imageSize, imageSize);
        }
    }
  };
};
export default function PowerBoard() {
    return <ReactP5Wrapper sketch={sketch} />;
}