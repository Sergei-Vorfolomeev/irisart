import { Roles } from './roles.enum'

export type UserDBModel = {
  login: string
  email: string
  password: string
  role: Roles
  createdAt?: Date
  updatedAt?: Date
  isBanned?: boolean
}
