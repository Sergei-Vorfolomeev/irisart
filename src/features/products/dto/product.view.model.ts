import { ProductsType } from '../types/products-type.enum'

export type ProductViewModel = {
  id: string
  type: ProductsType
  name: string
  description: string
  price: number
  image?: string
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}
