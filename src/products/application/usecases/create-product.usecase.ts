import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace CreateProductUseCase {
  export type Input = {
    name: string
    sku: string
    stock: number
    price: number
  }

  export type Output = ProductOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { sku, name, price, stock } = input

      if (!sku || !name || !price || !stock) {
        throw new BadRequestError('Input data not provided')
      }

      await this.productRepository.skuExists(sku)

      const entity = new ProductEntity(input)

      await this.productRepository.insert(entity)
      return ProductOutputMapper.toOutput(entity)
    }
  }
}
