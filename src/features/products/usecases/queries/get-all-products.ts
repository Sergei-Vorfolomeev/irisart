import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ProductsQueryRepository } from '../../repositories/products.query.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { ProductViewModel } from '../../dto/product.view.model'
import { ProductsType } from '../../types/products-type.enum'

export class GetAllProductsQuery {
  constructor(
    public term: string | undefined,
    public type: ProductsType | undefined,
    public offset: number | undefined,
    public limit: number | undefined,
  ) {}
}

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsQueryHandler implements IQueryHandler {
  constructor(
    private readonly productsQueryRepository: ProductsQueryRepository,
  ) {}

  async execute(
    queryParams: GetAllProductsQuery,
  ): Promise<InterLayerObject<ProductViewModel[]>> {
    const products = await this.productsQueryRepository.getAll(queryParams)
    if (!products) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка запроса товаров',
      )
    }
    return new InterLayerObject<ProductViewModel[]>(
      StatusCode.Success,
      null,
      products,
    )
  }
}
