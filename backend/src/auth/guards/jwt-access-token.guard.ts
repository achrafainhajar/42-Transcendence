import { PrismaService } from './../../prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/payload';
import { Request } from 'express';
import { User } from '@prisma/client';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAccessTokenGuard extends AuthGuard('jwt-access-token') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info, status) {
    //console.log("handleRequest AT ", err, user?.id);
    //console.log({
    //	err,
    //	user,
    //	info,
    //	status
    //});
	//console.log(
	//	{info}
	//);
	
    if (err || !user) {
    //  return "user null";
       throw new UnauthorizedException();
    }
    if (!user.is_profile_finished)
      throw new HttpException('incomplete profile', 403);
    return user;
  }
}

//@Injectable()
//export class JWTAccessTokenGuard implements CanActivate {
//  constructor(
//    private config: ConfigService,
//    private prismaService: PrismaService,
//  ) {}

//  async canActivate(context: ExecutionContext): Promise<boolean> {
//    const req: Request & { user: undefined | User } = context
//      .switchToHttp()
//      .getRequest();
//    const token = req.cookies?.accessToken;
//    if (!token) throw new UnauthorizedException('Invalid Token');
//    let payload;
//    try {
//      payload = jwt.verify(
//        token,
//        this.config.get('JWT_ACCESS_TOKEN_SECRET'),
//      ) as JwtPayload;
//    } catch (e) {
//      throw new UnauthorizedException();
//    }
//    req.user = await this.prismaService.user.findUnique({
//      where: {
//        id: payload.id,
//      },
//    });

//    if (!req.user) throw new UnauthorizedException();
//    if (
//      !req.user.is_profile_finished &&
//      !(
//        req.path === '/auth/me' ||
//        (req.path === '/users' && req.method == 'PUT')
//      )
//    )
//      throw new HttpException('incomplete profile', 403);
//    return true;
//  }
//}
