import { cookieExtractor } from './../helpers/cookie.extractor';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: 'mySecret',
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
