import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { ProductsType } from '../../types/products-type.enum'
import { ProductsRepository } from '../../repositories/products.repository'
import { ProductDbModel } from '../../types/product-db.model'

export class AddProductCommand {
  constructor(
    public name: string,
    public description: string,
    public type: ProductsType,
    public price: number,
    public image: string | undefined,
    public isAvailable: boolean,
  ) {}
}

@CommandHandler(AddProductCommand)
export class AddProductCommandHandler implements ICommandHandler {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    name,
    description,
    type,
    price,
    image,
    isAvailable,
  }: AddProductCommand): Promise<InterLayerObject<string>> {
    const newProduct: ProductDbModel = {
      name,
      description,
      type,
      price,
      image,
      isAvailable,
    }
    const createdProduct = await this.productsRepository.addProduct(newProduct)
    if (!createdProduct) {
      return new InterLayerObject(
        StatusCode.ServerError,
        `Ошибка создания продукта ${name}`,
      )
    }
    return new InterLayerObject(StatusCode.Created, null, createdProduct.id)
  }
}
