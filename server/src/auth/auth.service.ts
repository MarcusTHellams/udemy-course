import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { User } from 'src/user/entities/user.entity';
import bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(private readonly repo: RepoService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.repo.userRepo.findOne({
      select: ['username', 'id', 'password', 'email'],
      where: { username },
    });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        const { password, ...result } = user;
        const userRoles = await this.repo.userRoleRepo
          .createQueryBuilder('userRole')
          .innerJoinAndSelect('userRole.role', 'roles')
          .where('userRole.userId = :userId', { userId: user.id })
          .getMany();

        result.roles = userRoles.map((ur) => ur.role);

        return result;
      }
    }

    return null;
  }

  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
