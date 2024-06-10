import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { AddProductCommandHandler } from './usecases/commands/add-product.command'
import { GetProductByIdQueryHandler } from './usecases/queries/get-product-by-id.query'
import { ProductsRepository } from './repositories/products.repository'
import { ProductsQueryRepository } from './repositories/products.query.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { GetAllProductsQueryHandler } from './usecases/queries/get-all-products.query'
import { DeleteProductCommandHandler } from './usecases/commands/delete-product.command'
import { UpdateProductCommandHandler } from './usecases/commands/update-product.command'

const productsUseCases = [
  GetAllProductsQueryHandler,
  GetProductByIdQueryHandler,
  AddProductCommandHandler,
  UpdateProductCommandHandler,
  DeleteProductCommandHandler,
]

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CqrsModule],
  controllers: [ProductsController],
  providers: [...productsUseCases, ProductsRepository, ProductsQueryRepository],
  exports: [],
})
export class ProductsModule {}
