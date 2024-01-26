import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { FTAuthGuard } from './guards/FTAuth.guard';
import { JwtAccessTokenStrategy } from 'src/auth/strategy/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from 'src/auth/strategy/jwt-refresh-token.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    FTAuthGuard,
    FortyTwoStrategy,
  ],
})
export class AuthModule {}
