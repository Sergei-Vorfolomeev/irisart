import { Roles } from '../types/roles.enum'

export type UserBanViewModel = {
  id: string
  userName: string
  email: string
  role: Roles
  createdAt: Date
  banInfo: {
    status: boolean
    reason: string
    bannedAt: Date
  }
}
