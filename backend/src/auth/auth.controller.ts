import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { FTAuthGuard } from './guards/FTAuth.guard';
import { GetCurrentUser } from '../common/getCurrentUser';
import { JWTAccessTokenGuard } from './guards/jwt-access-token.guard';
import { JWTRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Update2faDto } from 'src/auth/dto/update-2fa.dto';
import { v4 as uuidv4 } from 'uuid';
import { Validate2faDto } from 'src/auth/dto/validate-2fa.dto';
import { RateLimiterGuard } from 'nestjs-rate-limiter';
import { RateLimit } from 'nestjs-rate-limiter';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
    protected readonly config: ConfigService,
  ) {}
  // login with 42

  //  @UseGuards(RateLimiterGuard)
  @RateLimit({
    keyPrefix: 'sign-in',
    points: 4,
    duration: 1,
    errorMessage: 'Too many login attempts, please try again later',
  })
  @UseGuards(FTAuthGuard)
  //  @SetMetadata('isPublic', true)
  @Get('signin')
  auth42() {
    return { message: 'auth42' };
  }

  @RateLimit({
    keyPrefix: 'sign-in',
    points: 2,
    duration: 1,
    errorMessage: 'Too many login attempts, please try again later',
  })
  @UseGuards(FTAuthGuard)
  //  @SetMetadata('isPublic', true)
  @Get('42/callback')
  async auth42Redirect(
    @Req() req,
    @Res({ passthrough: true }) res,
    @GetCurrentUser() user,
  ) {
    //const { user_id } = req.query;
    //if(user_id)
    //	user = await this.prisma.user.findUnique({
    //		where: {
    //			id: (user_id)
    //		}
    //	});

    if (user && !user.two_factor_auth_enabled) {
      await this.authService.signIn(user, res);
      try {
        return res.redirect(this.config.get('FRONTEND_URL') + '/profile');
      } catch (error) {
        //console.log('HEADER ERROR  two_factor_auth_disabled 7SALTI', error);
      }

      //return {user}
    } else if (user && user.two_factor_auth_enabled) {
      const uui = uuidv4();
      await this.authService.twofactoruuid(user, uui);

      try {
        return res.redirect(this.config.get('FRONTEND_URL') + '/2fa/' + uui);
      } catch (error) {
        //console.log('HEADER ERROR  two_factor_auth_enabled 7SALTI', error);
      }
    } else {
      //throw new UnauthorizedException();
      try {
        return res.redirect(
          this.config.get('FRONTEND_URL') + '/login?error=unauthorized',
        );
      } catch (error) {
        //console.log('HEADER ERROR  unauthorized signin 7SALTI', error);
      }
    }
  }

  //  @SetMetadata('isPublic', true)
  @Post('2fa')
  async auth2fa(@Body() body: Validate2faDto, @Res({ passthrough: true }) res) {
    const { verify, user } = await this.authService.verify2fa(
      body.uuid,
      body.code,
    );

    if (verify) {
      await this.authService.signIn(user, res);
      //res.redirect(this.config.get('FRONTEND_URL') + '/profile');
      try {
        res.status(200);
		return { message: '2fa verified' };
      } catch (error) {
        //console.log('HEADER ERROR  2fa 7SALTI', error);
      }
      //return {user}
    } else {
      //throw new UnauthorizedException();
      throw new HttpException('2fa not verified', 400);
    }
  }

  @UseGuards(JWTRefreshTokenGuard)
  @Get('signout')
  async logout(
    @GetCurrentUser() user,
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    //throw new Error("Cannot remove headers after they are sent to the client")

    await this.authService.signOut(user, res, req.cookies?.refreshToken);
    //res.json({ message: 'logout' });
  }

  @UseGuards(JWTRefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });
    return await this.authService.RefreshToken(
      user,
      res,
      req.cookies?.refreshToken,
    );
  }

  @UseGuards(AuthGuard('jwt-access-token'))
  //  @UseGuards(JWTAccessTokenGuard)
  @Get('me')
  async me(@GetCurrentUser() user) {
    return user;
  }

  //  @UseGuards(JWTAccessTokenGuard)
  //  @Get('me')
  //  async me(@Req() req, @GetCurrentUser() user,@Res({
  //	passthrough: false
  //  }) res:Response) {
  //	res.json(user);
  //	res.cookie('user', JSON.stringify(user), { httpOnly: false });
  //    //return user;
  //  }

  @UseGuards(JWTAccessTokenGuard)
  @Post('update2fa')
  async update2fa(@Body() update2fa: Update2faDto, @GetCurrentUser() user) {
    return this.authService.update2fa(user, update2fa.code, update2fa.secret);
  }

  @UseGuards(JWTAccessTokenGuard)
  @Get('generate2fa')
  async generate2fa(@GetCurrentUser() user) {
    return await this.authService.generate2fa(user);
  }
}
