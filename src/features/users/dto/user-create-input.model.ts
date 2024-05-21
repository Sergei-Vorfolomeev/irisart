import { Roles } from '../types/roles.enum'
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'

export class UserCreateInputModel {
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

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles
}
