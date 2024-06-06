import { ProductsType } from './products-type.enum'

export type ProductDbModel = {
  id?: string
  type: ProductsType
  name: string
  description: string
  price: number
  image?: string
  isAvailable: boolean
  created_at?: Date
  updated_at?: Date
}
