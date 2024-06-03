import { Roles } from './roles.enum'

export type UserDBModel = {
  id: string
  userName: string
  email: string
  password: string
  refreshToken?: string | null
  role: Roles
  createdAt?: Date
  updatedAt?: Date
  emailConfirmation?: EmailConfirmationType
  banInfo?: BanType
  passwordRecovery?: PasswordRecoveryType
}

export type EmailConfirmationType = {
  userId: string
  isConfirmed: boolean
  confirmationCode: number
  expirationDate: Date
}

type BanType = {
  status: boolean
  bannedAt: Date
}

type PasswordRecoveryType = {
  userId: string
  recoveryCode: string
  expiredAt: Date
  updatedAt: Date
}
