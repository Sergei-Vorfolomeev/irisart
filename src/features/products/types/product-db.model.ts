import { ProductsCategory } from './products-type.enum'

export type ProductDbModel = {
  id?: string
  category: ProductsCategory
  name: string
  description: string
  price: number
  image?: string
  isAvailable: boolean
  created_at?: Date
  updated_at?: Date
}
