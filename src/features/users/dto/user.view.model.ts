import { Roles } from '../types/roles.enum'

export type UserViewModel = {
  id: string
  userName: string
  email: string
  role: Roles
  banStatus: boolean
  createdAt: Date
}
