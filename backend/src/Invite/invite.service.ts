import { Injectable } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InviteService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateInviteDto) {
    try {		
      const invite = await this.prisma.invite.findFirst({
        where: {
          actor_id:data.actor_id,
          target_id:data.target_id,
		  mode:data.mode,
        }
      })	  
      if(!invite)
      {
        return await this.prisma.invite.create({ data });
      }
	  return invite;
    }
    catch
    {

    }
  }

  async findAllMyReq(user_id: string) {
    try {
      return await this.prisma.invite.findMany({
        where: {
          target_id: user_id,
        }
      }
      );
    }
    catch
    {

    }
  }

  async RemoveInvite(id: string, user_id: string) {
    try {
      const invite = await this.prisma.invite.findUnique({
        where: {
          id: id,
        },
      });
      if (
        !invite ||
        (invite.target_id != user_id && invite.actor_id != user_id)
      )
        return; // hadi notif wa9ila
      return await this.prisma.invite.delete({
        where: {
          id: id,
        },
      });
    } catch {}
  }
  async findFirst(id: string, userId: string) {
    try {
      return await this.prisma.invite.findUnique({
        where: {
          id: id,
          target_id: userId,
        },
      });
    } catch {}
  }
  async findUnique(id: string) {
    try {
      return await this.prisma.invite.findUnique({
        where: {
          id: id,
        },
      });
    } catch {}
  }
  async setStart(stat:boolean,invite_id:string)
  {
    return await this.prisma.invite.update({
      where:
      {
        id: invite_id,
      },
      data:
      {
        start:stat,
      }
    }
    );
  }
  // update(id: number, updateInviteDto: UpdateInviteDto) {
  //   return `This action updates a #${id} invite`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} invite`;
  // }
}
