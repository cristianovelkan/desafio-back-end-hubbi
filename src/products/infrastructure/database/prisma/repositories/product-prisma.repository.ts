import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductRepository } from '@/products/domain/repositories/product.repository'

export class ProductPrismaRepository implements ProductRepository.Repository {
  sortableFields: string[]

  constructor(private prismaService: PrismaService) {}

  findBySku(sku: string): Promise<ProductEntity> {
    throw new Error('Method not implemented.')
  }

  skuExists(sku: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  search(
    props: ProductRepository.SearchParams,
  ): Promise<ProductRepository.SearchResult> {
    throw new Error('Method not implemented.')
  }

  insert(entity: ProductEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<ProductEntity> {
    throw new Error('Method not implemented.')
  }

  findAll(): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.')
  }

  update(entity: ProductEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
