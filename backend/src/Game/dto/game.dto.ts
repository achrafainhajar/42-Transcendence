import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsUUID()
  player1_id: string;
  @IsNotEmpty()
  @IsUUID()
  player2_id: string;

  @IsNotEmpty()
  @IsNumber()
  score1: number;

  @IsNotEmpty()
  @IsNumber()
  score2: number;
}

export class UpdateGameDto {
  @IsUUID()
  winner_id?: string;
  @IsNotEmpty()
  @IsNumber()
  score1: number;
  @IsNotEmpty()
  @IsNumber()
  score2: number;
}
