import { ValidationError } from '@/shared/domain/errors/validation-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { Product } from '@prisma/client'

export class ProductModelMapper {
  static toEntity(model: Product) {
    const data = {
      name: model.name,
      sku: model.sku,
      stock: model.stock,
      price: model.price,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }

    try {
      return new ProductEntity(data, model.id)
    } catch {
      throw new ValidationError('An entity not be loaded')
    }
  }
}
