import { IsUUID, Length } from 'class-validator'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'

export class UserBanInputModel {
  @IsUUID()
  @IsValidString()
  userId: string

  @Length(3, 100)
  @IsValidString()
  banReason: string
}
