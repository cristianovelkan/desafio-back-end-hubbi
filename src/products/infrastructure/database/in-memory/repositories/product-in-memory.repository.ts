import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'

export class ProductInMemoryRepository
  extends InMemorySearchableRepository<ProductEntity>
  implements ProductRepository.Repository
{
  sortableFields: string[] = ['name', 'price', 'createdAt']

  async findBySku(sku: string): Promise<ProductEntity> {
    const entity = this.items.find(item => item.sku === sku)
    if (!entity) {
      throw new NotFoundError(`Entity not found using sku ${sku}`)
    }
    return entity
  }

  async skuExists(sku: string): Promise<void> {
    const entity = this.items.find(item => item.sku === sku)
    if (entity) {
      throw new ConflictError('Sku already used')
    }
  }

  protected async applyFilter(
    items: ProductEntity[],
    filter: ProductRepository.Filter,
  ): Promise<ProductEntity[]> {
    if (!filter) {
      return items
    }
    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected async applySort(
    items: ProductEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<ProductEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}
