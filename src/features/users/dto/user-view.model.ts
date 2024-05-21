import { Roles } from '../types/roles.enum'

export type UserViewModel = {
  id: string
  login: string
  email: string
  role: Roles
  banStatus: boolean
  createdAt: Date
}
