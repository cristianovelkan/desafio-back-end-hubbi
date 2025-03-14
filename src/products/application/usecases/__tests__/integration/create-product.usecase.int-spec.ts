import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { CreateProductUseCase } from '../../create-product.usecase'

describe('CreateProductUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: CreateProductUseCase.UseCase
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
    sut = new CreateProductUseCase.UseCase(repository)
    await prismaService.product.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should create a product', async () => {
    const props = {
      name: 'test name',
      sku: 'abc123456',
      stock: 10,
      price: 100,
    }
    const output = await sut.execute(props)
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})
