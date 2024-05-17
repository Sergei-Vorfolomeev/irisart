import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('bans')
export class Ban {
  @PrimaryColumn()
  @OneToOne(() => User, (user) => user.banInfo)
  userId: string

  @Column({ default: false })
  status: boolean

  @Column({ nullable: true })
  reason: string

  @Column({ nullable: true })
  bannedAt: Date
}
