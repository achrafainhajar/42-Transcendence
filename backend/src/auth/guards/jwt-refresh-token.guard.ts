import { PrismaService } from './../../prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/payload';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTRefreshTokenGuard extends AuthGuard('jwt-refresh-token') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // if(user === false) return null;

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

//@Injectable()
//export class JWTRefreshTokenGuard implements CanActivate {
//  constructor(
//    private config: ConfigService,
//    private prismaService: PrismaService,
//  ) {}

//  async canActivate(context: ExecutionContext): Promise<boolean> {
//    const req = context.switchToHttp().getRequest();
//    const token = req.cookies?.refreshToken;
//    if (!token) throw new UnauthorizedException('Invalid Token');
//    try {
//      const payload = jwt.verify(
//        token,
//        this.config.get('JWT_REFRESH_TOKEN_SECRET'),
//      ) as JwtPayload;

//      req.user = await this.prismaService.user.findUnique({
//        where: {
//          id: payload.id,
//        },
//      });
//    } catch (e) {

//      throw new UnauthorizedException();
//    }
//	if (!req.user) throw new UnauthorizedException();
//    return true;
//  }
//}
