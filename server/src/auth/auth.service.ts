import { ModifiedUser } from './../types/modifiedUser.type';
import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import bcrypt = require('bcryptjs');
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly repo: RepoService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<ModifiedUser>> {
    const user = await this.repo.userRepo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'roles')
      .where('user.username = :username', { username })
      .getOne();

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        const modifiedResult: ModifiedUser = {
          username: user.username,
          id: user.id,
          email: user.email,
          roles: user.roles.map((role) => role.name),
          imageUrl: user.imageUrl,
        };

        return modifiedResult;
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = { ...user };
    return { access_token: this.jwtService.sign(payload) };
  }
}
