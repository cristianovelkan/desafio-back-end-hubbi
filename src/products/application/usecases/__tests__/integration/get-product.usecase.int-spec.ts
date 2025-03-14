import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { GetProductUseCase } from '../../get-product.usecase'

describe('GetProductUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetProductUseCase.UseCase
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
    sut = new GetProductUseCase.UseCase(repository)
    await prismaService.product.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('ProductModel not found using ID fakeId'),
    )
  })

  it('should returns a product', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    const model = await prismaService.product.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: entity._id })
    expect({ ...output, updatedAt: null }).toMatchObject({
      ...model,
      updatedAt: null,
    })
  })
})
