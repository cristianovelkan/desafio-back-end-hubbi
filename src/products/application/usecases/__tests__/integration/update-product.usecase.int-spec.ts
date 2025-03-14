import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { UpdateProductUseCase } from '../../update-product.usecase'

describe('UpdateProductUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdateProductUseCase.UseCase
  let repository: ProductPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new ProductPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new UpdateProductUseCase.UseCase(repository)
    await prismaService.product.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        name: 'fake name',
        sku: 'fake sku',
        stock: 10,
        price: 100,
      }),
    ).rejects.toThrow(
      new NotFoundError('ProductModel not found using ID fakeId'),
    )
  })

  it('should update a product', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await prismaService.product.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      id: entity._id,
      name: 'new name',
      sku: 'new sku',
      stock: 10,
      price: 100,
    })

    expect(output.name).toBe('new name')
  })
})
