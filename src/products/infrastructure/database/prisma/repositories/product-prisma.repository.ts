import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductModelMapper } from '../models/product-model.mapper'
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

  async insert(entity: ProductEntity): Promise<void> {
    await this.prismaService.product.create({
      data: entity.toJSON(),
    })
  }

  findById(id: string): Promise<ProductEntity> {
    return this._get(id)
  }

  async findAll(): Promise<ProductEntity[]> {
    const models = await this.prismaService.product.findMany()
    return models.map(model => ProductModelMapper.toEntity(model))
  }

  update(entity: ProductEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  protected async _get(id: string): Promise<ProductEntity> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
      })
      return ProductModelMapper.toEntity(product)
    } catch {
      throw new NotFoundError(`ProductModel not found usind ID ${id}`)
    }
  }
}
