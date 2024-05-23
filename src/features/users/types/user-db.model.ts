import { Roles } from './roles.enum'

export type UserDBModel = {
  id?: string
  login: string
  email: string
  password: string
  role: Roles
  createdAt?: Date
  updatedAt?: Date
  emailConfirmation?: EmailConfirmationType
  banInfo?: BanType
}

export type EmailConfirmationType = {
  userId: string
  isConfirmed: boolean
  confirmationCode: string
  expirationDate: Date
}

type BanType = {
  status: boolean
  bannedAt: Date
}
