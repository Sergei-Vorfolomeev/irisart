import { UserViewModel } from './user-view.model'

export type UserBanViewModel = UserViewModel & {
  banReason: string
  bannedAt: Date
}
