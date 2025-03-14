import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductModelMapper } from '../models/product-model.mapper'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
export class ProductPrismaRepository implements ProductRepository.Repository {
  sortableFields: string[] = ['name', 'price', 'createdAt']

  constructor(private prismaService: PrismaService) {}

  async findBySku(sku: string): Promise<ProductEntity> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { sku },
      })
      return ProductModelMapper.toEntity(product)
    } catch {
      throw new NotFoundError(`ProductModel not found using sku ${sku}`)
    }
  }

  async skuExists(sku: string): Promise<void> {
    const product = await this.prismaService.product.findUnique({
      where: { sku },
    })
    if (product) {
      throw new ConflictError(`Sku already used`)
    }
  }

  async search(
    props: ProductRepository.SearchParams,
  ): Promise<ProductRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

    const count = await this.prismaService.product.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.product.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    })

    return new ProductRepository.SearchResult({
      items: models.map(model => ProductModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
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

  async update(entity: ProductEntity): Promise<void> {
    await this._get(entity._id)
    await this.prismaService.product.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.prismaService.product.delete({
      where: { id },
    })
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
