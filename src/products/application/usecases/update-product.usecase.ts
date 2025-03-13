import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export namespace UpdateProductUseCase {
  export type Input = {
    id: string
    name: string
    sku: string
    stock: number
    price: number
  }

  export type Output = ProductOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequestError('Name not provided')
      }
      const entity = await this.productRepository.findById(input.id)
      entity.name = input.name
      entity.sku = input.sku
      entity.stock = input.stock
      entity.price = input.price
      await this.productRepository.update(entity)
      return ProductOutputMapper.toOutput(entity)
    }
  }
}
