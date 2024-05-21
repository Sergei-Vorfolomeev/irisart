import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator'

export class UserBanInputModel {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId: string

  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  banReason: string
}
