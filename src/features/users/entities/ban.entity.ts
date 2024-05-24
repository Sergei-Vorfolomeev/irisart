import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { User } from './user.entity'

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

  @OneToOne(() => User, (user) => user.banInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User
}
