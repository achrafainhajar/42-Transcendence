import { IsUUID, IsEnum, IsNotEmpty } from 'class-validator';

export enum RelationshipStatus {
  PENDING = 'pending',
  FRIEND = 'friends',
  BLOCKED = 'blocked',
}

export class CreateRelationshipDto {
  @IsNotEmpty()
  @IsUUID()
  user1_id: string;

  @IsNotEmpty()
  @IsUUID()
  user2_id: string;

  @IsNotEmpty()
  @IsEnum(RelationshipStatus)
  status: RelationshipStatus;
}
export class UpdateRelationshipDto {
  @IsNotEmpty()
  @IsEnum(RelationshipStatus)
  status: RelationshipStatus;

  @IsNotEmpty()
  @IsUUID()
  user1_id: string;
  
  @IsNotEmpty()
  @IsUUID()
  user2_id: string;
}
