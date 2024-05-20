import { Roles } from '../types/roles.enum'

export type UserInputModel = {
  login: string
  email: string
  password: string
  role: Roles
}
