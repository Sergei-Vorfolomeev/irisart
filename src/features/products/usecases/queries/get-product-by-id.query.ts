import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { ProductViewModel } from '../../dto/product.view.model'
import { ProductsQueryRepository } from '../../repositories/products.query.repository'

export class GetProductByIdQuery {
  constructor(public productId: string) {}
}

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdQueryHandler implements IQueryHandler {
  constructor(
    private readonly productsQueryRepository: ProductsQueryRepository,
  ) {}

  async execute({
    productId,
  }: GetProductByIdQuery): Promise<InterLayerObject<ProductViewModel>> {
    const product = await this.productsQueryRepository.getById(productId)

    if (!product) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Продукт c текущим id не найден',
      )
    }

    return new InterLayerObject<ProductViewModel>(
      StatusCode.Success,
      null,
      product,
    )
  }
}
