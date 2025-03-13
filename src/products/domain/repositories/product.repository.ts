import { RepositoryInterface } from '@/shared/domain/repositories/repository-contract'
import { ProductEntity } from '../entities/product.entity'

export interface ProductRepository extends RepositoryInterface<ProductEntity> {
  skuExists(sku: string): Promise<void>
}
