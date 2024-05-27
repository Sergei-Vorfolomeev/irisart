import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'
import { IsEmail } from 'class-validator'

export class LoginInputModel {
  @IsEmail()
  @IsValidString()
  email: string

  @IsValidString()
  password: string
}
