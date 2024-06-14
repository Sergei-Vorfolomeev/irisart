import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('email_confirmations')
export class EmailConfirmation {
  @PrimaryColumn('uuid')
  userId: string

  @Column({ default: false })
  isConfirmed: boolean

  @Column({ nullable: true })
  confirmationCode: number

  @Column({ nullable: true })
  expirationDate: Date

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User
}
