import { UserViewModel } from '../dto/user-view.model'
import { UserBanViewModel } from '../dto/user-ban-view.model'

export interface IUsersQueryRepository {
  getAll(): Promise<UserViewModel[] | null>

  getById(userId: string): Promise<UserViewModel | null>

  getBannedUsers(): Promise<UserBanViewModel[] | null>

  getBannedUserById(userId: string): Promise<UserBanViewModel | null>
}
