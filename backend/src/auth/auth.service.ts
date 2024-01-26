import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { authenticator } from 'otplib';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  getAccessToken(user: User) {
    const payload = { id: user.id };
    return jwt.sign(payload, this.config.get('JWT_ACCESS_TOKEN_SECRET'), {
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }

  getRefreshToken(user: User) {
    const payload = { id: user.id };
    return jwt.sign(payload, this.config.get('JWT_REFRESH_TOKEN_SECRET'), {
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
  }

  async signIn(user: User, res: Response) {
    const at = this.getAccessToken(user);
    const rt = this.getRefreshToken(user);
    const hrt = await bcrypt.hash(rt, 10);
    const rtExists = await this.prisma.refreshToken.findUnique({
      where: {
        token: hrt,
      },
    });
    if (!rtExists) {
      try {
        await this.prisma.refreshToken.create({
          data: {
            token: hrt,
            User: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } catch (error) {}
    }
    try {
      res.cookie('accessToken', at, { httpOnly: true });
      res.cookie('refreshToken', rt, { httpOnly: true, path: '/auth' });
    } catch (error) {
    //  console.log('HEADER ERROR signIn 7SALTI', error);
    }
  }
  async signOut(user: User, res: Response, refreshToken: string | null) {
    try {
      try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
      } catch (error) {
        //console.log('HEADER ERROR  signOut 7SALTI', error);
      }
      const rt = await this.prisma.refreshToken.findMany({
        where: {
          user_id: user?.id,
        },
      });
      if (rt.length == 0) return;
      const hts = rt.filter((t) => bcrypt.compareSync(refreshToken, t.token));
      if (hts.length == 0) return;
      await this.prisma.refreshToken.deleteMany({
        where: {
          token: { in: hts.map((t) => t.token) },
        },
      });
    } catch (error) {
    } finally {
      try {
        //res.json({ message: 'logout' });
		res.status(200);
		return { message: 'logout' };
      } catch (error) {
        //console.log('HEADER ERROR  signOut res.json 7SALTI', error);
      }
    }
  }
  async RefreshToken(user: User, res: Response, refreshToken: string) {
    const rt = await this.prisma.refreshToken.findMany({
      where: {
        user_id: user.id,
      },
    });
    if (rt.length == 0) throw new UnauthorizedException();
    const hts = rt.filter((t) => bcrypt.compareSync(refreshToken, t.token));
    if (hts.length == 0) throw new UnauthorizedException();
    const at = this.getAccessToken(user);
    try {
      res.cookie('accessToken', at, { httpOnly: true });
      res.status(200);
      return { message: 'refreshed' };
    } catch (error) {
    //  console.log('HEADER ERROR  RefreshToken 7SALTI', error);
    }
  }

  // cron for everyday
  @Cron('0 0 0 * * *')
  async clearRefreshTokens() {
    await this.prisma.refreshToken.deleteMany({
      where: {
        created_at: {
          // date before than 7 days ago
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });
  }

  async verify2fa(uuid: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        two_factor_uuid: uuid,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      verify: authenticator.verify({
        token: code,
        secret: user.two_factor_secret,
      }),
      user,
    };
  }

  async update2fa(user: User, code: string, secret: string) {
    authenticator.options = {
      digits: 6,
    };

    if (!user.two_factor_auth_enabled) {
      const verified = authenticator.verify({ token: code, secret });
      if (verified) {
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            two_factor_secret: secret,
            two_factor_auth_enabled: true,
          },
        });
        return { message: '2fa enabled' };
      } else {
        throw new HttpException('Invalid OTP', 400);
      }
    } else {
      if (
        !authenticator.verify({
          token: code,
          secret: user.two_factor_secret,
        })
      )
        throw new HttpException('Invalid OTP', 400);
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          two_factor_secret: null,
          two_factor_auth_enabled: false,
        },
      });
      return { message: '2fa disabled' };
    }
  }

  async generate2fa(user: User) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'ft_trans_42', secret);
    return { secret, otpauth };
  }

  async twofactoruuid(user: User, uuid: string) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        two_factor_uuid: uuid,
      },
    });
  }
}
