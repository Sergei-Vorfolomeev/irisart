import { ProductsCategory } from '../types/products-type.enum'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'
import { IsEnum, IsInt, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class GetAllProductsQueryParams {
  @IsValidString()
  @IsOptional()
  term?: string

  @IsEnum(ProductsCategory)
  @IsOptional()
  category?: ProductsCategory

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number
}
