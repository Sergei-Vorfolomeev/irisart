import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class RegistrationInputModel {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  login: string

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string

  @Length(6, 35)
  @IsString()
  @IsNotEmpty()
  password: string
}
