import { Roles } from './roles.enum'

export type UserDBModel = {
  id?: string
  login: string
  email: string
  password: string
  role: Roles
  createdAt?: Date
  updatedAt?: Date
  banInfo?: Ban
}

export type Ban = {
  status: boolean
  bannedAt: Date
}
