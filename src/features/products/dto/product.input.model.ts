import { ProductsCategory } from '../types/products-type.enum'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'
import { IsBoolean, IsEnum, IsInt } from 'class-validator'
import { Transform } from 'class-transformer'

export class ProductInputModel {
  @IsValidString()
  name: string

  @IsValidString()
  description: string

  @IsEnum(ProductsCategory)
  @IsValidString()
  category: ProductsCategory

  @IsInt()
  @Transform(({ value }) => Number(value))
  price: number

  @IsBoolean()
  isAvailable: boolean

  image?: string
}
