import { IsInt, IsNotEmpty } from 'class-validator'

export class ConfirmEmailInputModel {
  @IsInt()
  @IsNotEmpty()
  code: number
}
