import { User } from '../entities/user.entity'
import { EmailConfirmationType, UserDBModel } from '../types/user-db.model'

export interface IUsersRepository {
  getById(userId: string): Promise<User | null>

  create(
    user: UserDBModel,
    emailConfirmation: EmailConfirmationType,
  ): Promise<string | null>

  delete(userId: string): Promise<boolean>
}
