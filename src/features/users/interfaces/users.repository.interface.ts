import { User } from '../entities/user.entity'
import { UserDBModel } from '../types/user-db.model'

export interface IUsersRepository {
  getById(userId: string): Promise<User[] | null>

  create(user: UserDBModel): Promise<User | null>

  delete(userId: string): Promise<boolean>
}
