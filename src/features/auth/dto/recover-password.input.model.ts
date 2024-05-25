import { IsEmail } from 'class-validator'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'

export class RecoverPasswordInputModel {
  @IsEmail()
  @IsValidString()
  email: string
}
