import { ProductViewModel } from '../dto/product.view.model'
import { Product } from '../product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { GetAllProductsQueryParams } from '../dto/get-all-products-query-params'

export class ProductsQueryRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsOrmRepo: Repository<Product>,
  ) {}

  async getAll({
    term = '',
    category,
    limit = 5,
    offset = 0,
  }: GetAllProductsQueryParams): Promise<ProductViewModel[] | null> {
    try {
      const whereCondition: any = {
        name: ILike(`%${term}%`),
      }

      if (category) {
        whereCondition.category = category
      }

      const [products, total] = await this.productsOrmRepo.findAndCount({
        where: whereCondition,
        skip: offset,
        take: limit,
        order: {
          created_at: 'DESC',
        },
      })
      return products.map(this.mapToView)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getById(id: string): Promise<ProductViewModel | null> {
    try {
      const product = await this.productsOrmRepo.findOne({
        where: {
          id,
        },
      })
      if (!product) {
        return null
      }
      return this.mapToView(product)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  mapToView(product: Product): ProductViewModel {
    return {
      id: product.id,
      category: product.category,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      isAvailable: product.isAvailable,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }
  }
}
