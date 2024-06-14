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
import { EmailConfirmation } from './email-confirmation.entity'
import { PasswordRecovery } from './password-recovery.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userName: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null

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
    cascade: true,
    onDelete: 'CASCADE',
  })
  banInfo: Ban
}
