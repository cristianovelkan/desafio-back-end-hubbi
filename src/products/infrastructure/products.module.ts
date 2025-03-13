import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { CreateProductUseCase } from '../application/usecases/create-product.usecase'
import { ProductInMemoryRepository } from './database/in-memory/repositories/product-in-memory.repository'
import { ProductRepository } from '../domain/repositories/product.repository'
import { GetProductUseCase } from '../application/usecases/get-product.usecase'
import { ListProductsUseCase } from '../application/usecases/list-products.usecase'
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase'
import { DeleteProductUseCase } from '../application/usecases/delete-product.usecase'
@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: ProductInMemoryRepository,
    },
    {
      provide: CreateProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new CreateProductUseCase.UseCase(productRepository)
      },
      inject: ['ProductRepository'],
    },
    {
      provide: GetProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new GetProductUseCase.UseCase(productRepository)
      },
      inject: ['ProductRepository'],
    },
    {
      provide: ListProductsUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new ListProductsUseCase.UseCase(productRepository)
      },
      inject: ['ProductRepository'],
    },
    {
      provide: UpdateProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new UpdateProductUseCase.UseCase(productRepository)
      },
      inject: ['ProductRepository'],
    },
    {
      provide: DeleteProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new DeleteProductUseCase.UseCase(productRepository)
      },
      inject: ['ProductRepository'],
    },
  ],
})
export class ProductsModule {}
