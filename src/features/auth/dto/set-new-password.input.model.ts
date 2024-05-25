import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'
import { IsUUID } from 'class-validator'

export class SetNewPasswordInputModel {
  @IsUUID()
  @IsValidString()
  recoveryCode: string

  @IsValidString()
  newPassword: string
}
