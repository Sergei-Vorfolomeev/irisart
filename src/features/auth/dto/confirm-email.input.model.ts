import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ConfirmEmailInputModel {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  code: string
}
