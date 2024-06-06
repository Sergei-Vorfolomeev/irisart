import { ProductDbModel } from '../types/product-db.model'
import { Product } from '../product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsOrmRepo: Repository<Product>,
  ) {}

  async addProduct(product: ProductDbModel): Promise<Product | null> {
    try {
      return await this.productsOrmRepo.save(product)
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
