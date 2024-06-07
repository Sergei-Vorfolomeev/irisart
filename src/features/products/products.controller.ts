import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ProductAddInputModel } from './dto/product-add.input.model'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { AddProductCommand } from './usecases/commands/add-product.command'
import { GetProductByIdQuery } from './usecases/queries/get-product-by-id.query'
import { GetAllProductsQuery } from './usecases/queries/get-all-products.query'
import { GetAllProductsQueryParams } from './dto/get-all-products-query-params'
import { DeleteProductCommand } from './usecases/commands/delete-product.command'

@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(200)
  async getAllProducts(
    @Query() { term, category, offset, limit }: GetAllProductsQueryParams,
  ) {
    const query = new GetAllProductsQuery(term, category, offset, limit)
    const {
      statusCode,
      error,
      data: products,
    } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return products
  }

  @Post()
  @HttpCode(201)
  async addProduct(@Body() product: ProductAddInputModel) {
    const { name, description, category, price, image, isAvailable } = product
    const command = new AddProductCommand(
      name,
      description,
      category,
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

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') productId: string) {
    const command = new DeleteProductCommand(productId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
