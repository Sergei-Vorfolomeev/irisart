import { ProductsCategory } from '../types/products-type.enum'

export type ProductViewModel = {
  id: string
  category: ProductsCategory
  name: string
  description: string
  price: number
  image?: string
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}
