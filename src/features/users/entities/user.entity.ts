import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Roles } from '../types/roles.enum'
import { Ban } from './ban.entity'

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

  @Column({ enum: Roles, default: Roles.user })
  role: Roles

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => Ban, (ban) => ban.userId, { onDelete: 'CASCADE' })
  banInfo: Ban
}
