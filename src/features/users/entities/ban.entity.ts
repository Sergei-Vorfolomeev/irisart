import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm'
import { User } from './user.entity'

// @Entity('bans')
// export class Ban {
//   @PrimaryColumn('uuid')
//   @OneToOne(() => User, (user) => user.id)
//   @JoinColumn()
//   userId: string
//
//   @Column({ default: false })
//   status: boolean
//
//   @Column({ nullable: true })
//   reason: string
//
//   @Column({ nullable: true })
//   bannedAt: Date
// }

@Entity('bans')
export class Ban {
  @PrimaryColumn('uuid')
  userId: string

  @Column({ default: false })
  banStatus: boolean

  @Column({ nullable: true })
  banReason: string

  @Column({ nullable: true })
  bannedAt: Date

  @OneToOne(() => User, (user) => user.banInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User
}
