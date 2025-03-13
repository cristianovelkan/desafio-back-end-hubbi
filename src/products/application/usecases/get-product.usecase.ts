import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductOutput } from '../dtos/product-output'

export namespace GetProductUseCase {
  export type Input = {
    id: string
  }

  export type Output = ProductOutput

  export class UseCase {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.productRepository.findById(input.id)
      return entity.toJSON()
    }
  }
}
