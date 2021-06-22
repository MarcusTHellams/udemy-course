import { Role } from './../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class UserRole {
  @PrimaryColumn('varchar', { nullable: false })
  userId: string;

  @PrimaryColumn('varchar', { nullable: false })
  roleId: string;

  @ManyToOne(() => User, (user) => user.roles, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Role, (role) => role.users, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
