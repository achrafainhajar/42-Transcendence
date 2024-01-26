import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  @IsString()
  actor_id: string;
  @IsNotEmpty()
  @IsString()
  target_id: string;
  @IsOptional()
  @IsString()
  mode?: string;
}
