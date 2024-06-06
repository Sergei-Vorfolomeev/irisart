import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ProductAddInputModel } from './dto/product-add.input.model'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { AddProductCommand } from './usecases/commands/add-product.command'
import { GetProductByIdQuery } from './usecases/queries/get-product-by-id.query'
import { GetAllProductsQuery } from './usecases/queries/get-all-products'
import { GetAllProductsQueryParams } from './dto/get-all-products-query-params'

@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllProducts(
    @Query() { term, type, offset, limit }: GetAllProductsQueryParams,
  ) {
    const query = new GetAllProductsQuery(term, type, offset, limit)
    const {
      statusCode,
      error,
      data: products,
    } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return products
  }

  @Post()
  async addProduct(@Body() product: ProductAddInputModel) {
    const { name, description, type, price, image, isAvailable } = product
    const command = new AddProductCommand(
      name,
      description,
      type,
      price,
      image,
      isAvailable,
    )
    const {
      statusCode: code1,
      error: err1,
      data: createdProductId,
    } = await this.commandBus.execute(command)
    handleExceptions(code1, err1)

    const query = new GetProductByIdQuery(createdProductId)
    const {
      statusCode: code2,
      error: err2,
      data: createdProduct,
    } = await this.queryBus.execute(query)
    handleExceptions(code2, err2)
    return createdProduct
  }
}
