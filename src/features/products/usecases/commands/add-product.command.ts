import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { ProductsRepository } from '../../repositories/products.repository'
import { ProductDbModel } from '../../types/product-db.model'
import { ProductInputModel } from '../../dto/product.input.model'

export class AddProductCommand {
  constructor(public product: ProductInputModel) {}
}

@CommandHandler(AddProductCommand)
export class AddProductCommandHandler implements ICommandHandler {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    product,
  }: AddProductCommand): Promise<InterLayerObject<string>> {
    const {
      name,
      description,
      category: type,
      price,
      image,
      isAvailable,
    } = product
    const newProduct: ProductDbModel = {
      name,
      description,
      category: type,
      price,
      image,
      isAvailable,
    }
    const createdProduct = await this.productsRepository.saveProduct(newProduct)
    if (!createdProduct) {
      return new InterLayerObject(
        StatusCode.ServerError,
        `Ошибка создания продукта ${name}`,
      )
    }
    return new InterLayerObject(StatusCode.Created, null, createdProduct.id)
  }
}
