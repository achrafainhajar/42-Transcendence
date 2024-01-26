import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { useLocation, useParams} from 'react-router-dom';

import Game from './Game/Game';
import ScoreBoard from './Game/ScoreBoard';
import PowerBoard from './Game/PowerBoard';
import AvatarBoard from './Game/AvatarBoard';
import { WS_URL } from '../../constants';
export let socket_global: Socket;

const AppGame = () => {
  const socketR = useRef<Socket | null>(null);
  const { mode} = useParams();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const role = params.get('role');
  useEffect(() => {
    if (socketR.current == null) {
      socketR.current = io(WS_URL+'/Game',{
        query: {
          mode:mode,
          id:id,
          role:role,
        },
        withCredentials : true,
        transports: ["websocket"]
      });
      socket_global = socketR.current;
    }
  }, []);
  
  return (
    <div>
      <Game />
      <ScoreBoard />
      <PowerBoard />
      <AvatarBoard />
    </div>
  );
};

export default AppGame;
