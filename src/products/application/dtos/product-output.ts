import { ProductEntity } from '@/products/domain/entities/product.entity'

export type ProductOutput = {
  id: string
  name: string
  sku: string
  stock: number
  price: number
  createdAt: Date
  updatedAt?: Date
}

export class ProductOutputMapper {
  static toOutput(entity: ProductEntity): ProductOutput {
    return entity.toJSON()
  }
}
