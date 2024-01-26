import User from "./User";

export default interface GameHistory {
  id: string;
  player1_id: string;
  player2_id: string;
  score1: number;
  score2: number;
  winner_id: string;
  Player1: User;
  Player2: User;
}
