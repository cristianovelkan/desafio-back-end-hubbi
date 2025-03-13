import { ProductEntity } from '../entities/product.entity'
import { SearchableRepositoryInterface } from '@/shared/domain/repositories/searchable-repository-contract'
export interface ProductRepository
  extends SearchableRepositoryInterface<ProductEntity, any, any> {
  findBySku(sku: string): Promise<ProductEntity>
  skuExists(sku: string): Promise<void>
}
