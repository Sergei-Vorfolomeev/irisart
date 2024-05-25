import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Roles } from '../types/roles.enum'
import { Ban } from './ban.entity'
import { EmailConfirmation } from './email-confirmation'
import { PasswordRecovery } from '../../auth/entities/password-recovery.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  login: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  refreshToken: string

  @Column({ enum: Roles, default: Roles.user })
  role: Roles

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => EmailConfirmation, (e) => e.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  emailConfirmation: EmailConfirmation

  @OneToOne(() => PasswordRecovery, (pR) => pR.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  passwordRecovery: PasswordRecovery

  @OneToOne(() => Ban, (ban) => ban.user, {
    onDelete: 'CASCADE',
  })
  banInfo: Ban
}
