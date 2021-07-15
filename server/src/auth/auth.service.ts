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
    const user = await this.repo.userRepo.findOne({
      select: ['username', 'id', 'password', 'email', 'imageUrl'],
      where: { username },
    });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        const userRoles = await this.repo.userRoleRepo
          .createQueryBuilder('userRole')
          .innerJoinAndSelect('userRole.role', 'roles')
          .where('userRole.userId = :userId', { userId: user.id })
          .getMany();

        const modifiedResult: ModifiedUser = {
          username: user.username,
          id: user.id,
          email: user.email,
          roles: userRoles.map((ur) => ur.role.name),
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
