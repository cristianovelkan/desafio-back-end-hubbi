import { PrismaClient } from '@prisma/client'
import { ProductPrismaRepository } from '../../product-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'

describe('ProductPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: ProductPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new ProductPrismaRepository(prismaService as any)
    await prismaService.product.deleteMany()
  })

  it('should throws error when entity not found', async () => {
    expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('ProductModel not found usind ID FakeId'),
    )
  })

  it('should finds a entity by id', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    const newProduct = await prismaService.product.create({
      data: entity.toJSON(),
    })

    const output = await sut.findById(newProduct.id)

    expect({ ...output.toJSON(), updatedAt: null }).toStrictEqual({
      ...entity.toJSON(),
      updatedAt: null,
    })
  })

  it('should insert a new entity', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await sut.insert(entity)

    const result = await prismaService.product.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(result).toStrictEqual(entity.toJSON())
  })

  it('should returns all products', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await prismaService.product.create({
      data: entity.toJSON(),
    })

    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    entities.map(item =>
      expect({ ...item.toJSON(), updatedAt: null }).toStrictEqual({
        ...entity.toJSON(),
        updatedAt: null,
      }),
    )
  })
})
