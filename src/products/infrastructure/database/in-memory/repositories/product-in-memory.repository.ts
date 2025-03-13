import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'

export class ProductInMemoryRepository
  extends InMemorySearchableRepository<ProductEntity>
  implements ProductRepository
{
  async findBySku(sku: string): Promise<ProductEntity> {
    return new Promise((resolve, reject) => {
      try {
        const entity = this.items.find(item => item.sku === sku)
        if (!entity) {
          throw new NotFoundError(`Entity not found using sku ${sku}`)
        }
        resolve(entity)
      } catch (error) {
        reject(Error(error))
      }
    })
  }

  async skuExists(sku: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const entity = this.items.find(item => item.sku === sku)
        if (entity) {
          throw new ConflictError('Sku already used')
        }
        resolve()
      } catch (error) {
        reject(Error(error))
      }
    })
  }
}
