import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Profile42 } from '../types/profile42';
import { Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly config: ConfigService,
  ) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CALLBACK_URL'),
      scope: 'public',
      passReqToCallback: true,
      //...other options
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, username, _json } = profile;
    let user: any = {
      id,
      username,
      email: _json.email,
      first_name: _json.first_name,
      last_name: _json.last_name,
      avatar_url: _json.image.link,
    };

    if (!user) {
      throw new UnauthorizedException();
    }
    const userdb = await this.prismaService.user.findUnique({
      where: { oauth_id: user.id },
    });
    if (!userdb) {
      user = await this.prismaService.user.create({
        data: {
          oauth_id: user.id,
        },
      });
    } else user = userdb;

    return done(null, user);
  }
}
