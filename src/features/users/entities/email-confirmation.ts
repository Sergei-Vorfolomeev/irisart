import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('email_confirmations')
export class EmailConfirmation {
  @PrimaryColumn('uuid')
  userId: string

  @Column({ default: false })
  isConfirmed: boolean

  @Column({ type: 'uuid' })
  confirmationCode: string

  @Column()
  expirationDate: Date

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User
}
