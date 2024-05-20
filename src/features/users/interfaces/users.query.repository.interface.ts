import { User } from '../entities/user.entity'

export interface IUsersQueryRepository {
  getAll(): Promise<User[] | null>

  getById(userId: string): Promise<User | null>

  getBannedUsers(): Promise<User[] | null>
}
