import { ProductsType } from '../types/products-type.enum'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'
import { IsBoolean, IsEnum, IsInt } from 'class-validator'

export class ProductAddInputModel {
  @IsValidString()
  name: string

  @IsValidString()
  description: string

  @IsEnum(ProductsType)
  @IsValidString()
  type: ProductsType

  @IsInt()
  price: number

  @IsBoolean()
  isAvailable: boolean

  image?: string
}
