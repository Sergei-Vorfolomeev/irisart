import { IsNotEmpty, IsString } from 'class-validator'
import { Trim } from './trim.decorator'
import { applyDecorators } from '@nestjs/common'

export const IsValidString = () => {
  return applyDecorators(IsNotEmpty(), IsString(), Trim())
}
