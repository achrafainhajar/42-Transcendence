import { PartialType } from '@nestjs/mapped-types';
import { CreateInviteDto } from './create-invite.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateInviteDto extends PartialType(CreateInviteDto) {
  @IsNotEmpty()
  @IsUUID()
  id: number;
}
