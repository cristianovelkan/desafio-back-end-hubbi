import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository'
import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

export class ProductInMemoryRepository
  extends InMemoryRepository<ProductEntity>
  implements ProductRepository
{
  async skuExists(sku: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const entity = this.items.find(item => item.sku === sku)
        if (entity) {
          throw new ConflictError('sku already exists')
        }
        resolve()
      } catch (error) {
        reject(Error(error))
      }
    })
  }
}
