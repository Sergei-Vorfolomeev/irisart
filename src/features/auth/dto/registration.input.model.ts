import { IsEmail, Length } from 'class-validator'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'

export class RegistrationInputModel {
  @Length(3, 30)
  @IsValidString()
  login: string

  @IsEmail()
  @IsValidString()
  email: string

  @Length(6, 35)
  @IsValidString()
  password: string
}
