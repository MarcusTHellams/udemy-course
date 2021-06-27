import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.stategy';
import { RepoModule } from './../repo/repo.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RepoModule,
    PassportModule,
    JwtModule.register({
      secret: 'mySecret',
      signOptions: {
        expiresIn: '30m',
      },
    }),
  ],
  providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
