import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('password_recoveries')
export class PasswordRecovery {
  @PrimaryColumn()
  userId: string

  @OneToOne(() => User, (u) => u.id)
  @JoinColumn()
  user: User

  @Column({ type: 'uuid', nullable: true })
  recoveryCode: string

  @Column({ nullable: true })
  expiredAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
