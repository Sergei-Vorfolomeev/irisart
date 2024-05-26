import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('bans')
export class Ban {
  @PrimaryColumn('uuid')
  userId: string

  @Column({ default: false })
  status: boolean

  @Column({ nullable: true })
  reason: string

  @UpdateDateColumn({ nullable: true })
  bannedAt: Date

  @OneToOne(() => User, (user) => user.banInfo)
  @JoinColumn()
  user: User
}
