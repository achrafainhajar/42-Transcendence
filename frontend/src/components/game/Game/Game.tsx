import { P5CanvasInstance, ReactP5Wrapper, Sketch } from 'react-p5-wrapper';
import { socket_global } from '../AppGame';
import { Room } from './Room';
import { Paddle } from './Paddle';
import { Ball } from './Ball';
import pathbackgroundclassic from '../../../assets/GameImages/background_classic.png';
import pathbackgroundpower from '../../../assets/GameImages/background_power.png';
import pathwaiting from '../../../assets/GameImages/waiting2.png';
import pathloser from '../../../assets/GameImages/loser.png';
import pathwinner from '../../../assets/GameImages/winner.png';
import pathstupid from '../../../assets/GameImages/stupid.png';
export let room: Room | null;
export let width_canvas: number;
export let height_canvas: number;
export let status_winner: string;
export let canvasX: number;
export let canvasY: number;
let imageSize: number;
let textSize: number;
let cnvas: any;
const sketch: Sketch = (p5: P5CanvasInstance) => {
  const imgbackclassic = p5.loadImage(pathbackgroundclassic);
  const imgbackpower = p5.loadImage(pathbackgroundpower);
  const imgwaiting = p5.loadImage(pathwaiting);
  const imgloser = p5.loadImage(pathloser);
  const imgwinner = p5.loadImage(pathwinner);
  const imgstupid = p5.loadImage(pathstupid);
  status_winner =  "";
  room = null;
  let navigate = false;
  socket_global?.on('room_joined', (r) => {
    if (!room) {
      room = new Room(r.id_room, r.mode);
    }
    if (room && room.id_room == r.id_room && r.status == 'start') {
      room.status = r.status;
      if (r.player1)
        room.player1 = new Paddle(
          p5,
          r.player1,
          r.width_canvas,
          r.height_canvas,
          width_canvas,
          height_canvas,
        );
      if (!room.player2) {
        room.player2 = new Paddle(
          p5,
          r.player2,
          r.width_canvas,
          r.height_canvas,
          width_canvas,
          height_canvas,
        );
      }
      if (r.ball)
        room.ball = new Ball(
          p5,
          r.ball?.x,
          r.ball?.y,
          r.ball?.r,
          width_canvas,
          height_canvas,
          r.ball?.width_canvas,
          r.ball?.height_canvas,
        );
    }
  });

  socket_global?.on('update_ball', (data) => {
    if (room && room.id_room == data.id_room && room.ball) {
      room.ball.x = (data.ball.x * width_canvas) / data.ball?.width_canvas;
      room.ball.y = (data.ball.y * height_canvas) / data.ball?.height_canvas;
      if (room.player1 && room.player2) {
        room.player1.score = data.ball.leftscore;
        room.player2.score = data.ball.rightscore;
      }
      if (data.winner) {
        room.winner = new Paddle(p5, data.winner, 0, 0, 0, 0);
        room.status = data.status;
        room.remove_room(socket_global);
        room = null;
      }
    }
  });
  socket_global?.on('move_paddle', (data) => {
    if (room) {
      if (room.player1 && room.player1.id_socket == data.id) {
        room.player1.y =
          (data.room.player1.y * height_canvas) / data.room.height_canvas;
        room.player1.height =
          (data.room.player1.height * height_canvas) / data.room.height_canvas;
        room.player1.power = data.room.player1.power;
      } else if (room.player2 && room.player2.id_socket == data.id) {
        room.player2.y =
          (data.room.player2.y * height_canvas) / data.room.height_canvas;
        room.player2.height =
          (data.room.player2.height * height_canvas) / data.room.height_canvas;
        room.player2.power = data.room.player2.power;
      }
    }
  });
  socket_global?.on('game_over',(s) => {
    status_winner = s;
  })
  socket_global?.on('remove_room', (r) => {
    {
      if (room) {
        room.winner = new Paddle(p5, r.winner, 0, 0, 0, 0);
        room.remove_room(socket_global);
        room = null;
      }
    }
  });
  const handlePopstate = () => {
    if (navigate)
    {
      socket_global?.disconnect();
      navigate = false;
    }
  };
  p5.setup = () => {
    navigate =  true;
    window.addEventListener('popstate', handlePopstate);
    width_canvas = window.innerWidth * 0.4;
    height_canvas = width_canvas * (9 / 16);
    if (width_canvas && height_canvas) 
    {
      socket_global?.emit('start_game');
    }
    canvasX = (window.innerWidth - width_canvas) / 2;
    canvasY = ((window.innerHeight - height_canvas) / 2) + 100;
    cnvas = p5.createCanvas(width_canvas, height_canvas);
    cnvas.position(canvasX, canvasY);
    imageSize = height_canvas * 0.9;
    textSize = imageSize * 0.1;
    p5.textFont('sans-serif');
  };

  p5.windowResized = () => {
    const prev_height = height_canvas;
    const prev_width = width_canvas;
    width_canvas = window.innerWidth * 0.4;
    height_canvas = width_canvas * (9 / 16);
    canvasX = (window.innerWidth - width_canvas) / 2;
    canvasY = ((window.innerHeight - height_canvas) / 2) + 100;
    p5.resizeCanvas(width_canvas, height_canvas);
    cnvas.position(canvasX, canvasY);
    if (room && room.ball && room.player2 && room.player1) {
      room.player1.x *= width_canvas / prev_width;
      room.player1.y *= height_canvas / prev_height;
      room.player1.width *= width_canvas / prev_width;
      room.player1.height *= height_canvas / prev_height;
      room.player1.width_canvas = width_canvas;
      room.player1.height_canvas = height_canvas;
      room.player2.x *= width_canvas / prev_width;
      room.player2.y *= height_canvas / prev_height;
      room.player2.width *= width_canvas / prev_width;
      room.player2.height *= height_canvas / prev_height;
      room.player2.width_canvas = width_canvas;
      room.player2.height_canvas = height_canvas;
      room.ball.height_canvas = height_canvas;
      room.ball.width_canvas = width_canvas;
      room.ball.x = (room.ball.x * width_canvas) / prev_width;
      room.ball.y = (room.ball.y * height_canvas) / prev_height;
      room.ball.r = (room.ball.r * width_canvas) / prev_width;
    }
    imageSize = height_canvas * 0.9;
    textSize = imageSize * 0.1;
  };

  p5.draw = () => {
    cnvas.clear();
    const imageX = width_canvas / 2 - imageSize / 2;
    if ( room && room.player1 && room.player2 && room.status == 'start' && status_winner == '')
    {
      if (room.mode == 'classic') 
        p5.background(imgbackclassic);
      else p5.background(imgbackpower);
      room.player1?.move(socket_global, room.mode);
      room.player2?.move(socket_global, room.mode);
      room.player1.show();
      room.player2.show();
      room.ball?.show(room.mode);
      socket_global?.emit('send_ball');
    } else if (!room && status_winner == '')
      p5.image(imgwaiting, imageX, 0, imageSize, imageSize);
    else if (status_winner != '' && room ==  null) {
      p5.fill(0);
      p5.textSize(textSize);
      if (status_winner == 'exist')
      {
        p5.image(imgstupid, imageX, 0, imageSize, imageSize);
        const str: string = 'Where are you going?';
        p5.text(str, width_canvas / 2 - p5.textWidth(str) / 2, imageSize + 10);
      }
      else if (status_winner == 'You win') {
        p5.image(imgwinner, imageX, 0, imageSize, imageSize);
        const str: string = 'あなたの勝ち';
        p5.text(str, width_canvas / 2 - p5.textWidth(str) / 2, imageSize + 10);
      } else if (status_winner == 'You lose') {
        p5.image(imgloser, imageX, 0, imageSize, imageSize);
        const str: string = 'あなたの負け';
        p5.text(str, width_canvas / 2 - p5.textWidth(str) / 2, imageSize + 10);
      }
    }
  };
};
export default function Game() {
  return (
    <div className='w-1/2'>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}
