import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { BadRequestError } from '../errors/bad-request-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'

export namespace CreateProductUseCase {
  export type Input = {
    name: string
    sku: string
    stock: number
    price: number
  }

  export type Output = {
    id: string
    name: string
    sku: string
    stock: number
    price: number
    createdAt: Date
  }

  export class UseCase {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { sku, name, price, stock } = input

      if (!sku || !name || !price || !stock) {
        throw new BadRequestError('Input data not provided')
      }

      await this.productRepository.skuExists(sku)

      const entity = new ProductEntity(input)

      await this.productRepository.insert(entity)
      return entity.toJSON()
    }
  }
}
