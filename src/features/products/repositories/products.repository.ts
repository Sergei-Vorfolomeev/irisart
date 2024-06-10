import { ProductDbModel } from '../types/product-db.model'
import { Product } from '../product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsOrmRepo: Repository<Product>,
  ) {}

  async getById(productId: string): Promise<Product | null> {
    try {
      return await this.productsOrmRepo.findOne({
        where: {
          id: productId,
        },
      })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const res = await this.productsOrmRepo.delete(productId)
      return res.affected === 1
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async saveProduct(product: ProductDbModel): Promise<Product | null> {
    try {
      return await this.productsOrmRepo.save(product)
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
