import { UserViewModel } from './user.view.model'
import { Roles } from '../types/roles.enum'

export type UserBanViewModel = {
  id: string
  login: string
  email: string
  role: Roles
  createdAt: Date
  banInfo: {
    status: boolean
    reason: string
    bannedAt: Date
  }
}
