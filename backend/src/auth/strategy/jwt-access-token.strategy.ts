import { Injectable, Req, HttpException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/payload';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    //console.log('constructor   ',process.env.JWT_ACCESS_TOKEN_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
    //  secretOrKey: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
	  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    //console.log('JWT_ACCESS_TOKEN_SECRET   ',process.env.JWT_ACCESS_TOKEN_SECRET);
    
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    // if (!user.is_profile_finished)
    //   throw new HttpException('incomplete profile', 403);

    return user;
  }
}
