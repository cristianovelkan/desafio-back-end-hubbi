import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { ListProductsUseCase } from '../../list-products.usecase'

describe('ListProductsUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: ListProductsUseCase.UseCase
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
    sut = new ListProductsUseCase.UseCase(repository)
    await prismaService.product.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should return the products ordered by createdAt', async () => {
    const createdAt = new Date()
    const entities: ProductEntity[] = []
    const arrange = Array(3).fill(ProductDataBuilder({}))
    arrange.forEach((element, index) => {
      entities.push(
        new ProductEntity({
          ...element,
          sku: `abc${index}def`,
          stock: 10,
          price: 100,
          createdAt: new Date(createdAt.getTime() + 1000 * index),
        }),
      )
    })
    await prismaService.product.createMany({
      data: entities.map(item => item.toJSON()),
    })
    const output = await sut.execute({})
    expect(
      output.items.map(item => ({
        ...item,
        updatedAt: null,
      })),
    ).toStrictEqual(
      entities.reverse().map(item => ({
        ...item.toJSON(),
        updatedAt: null,
      })),
    )
  })

  it('should returns output using filter, sort and paginate', async () => {
    const createdAt = new Date()
    const entities: ProductEntity[] = []
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
    arrange.forEach((element, index) => {
      entities.push(
        new ProductEntity({
          ...ProductDataBuilder({ name: element }),
          createdAt: new Date(createdAt.getTime() + index),
        }),
      )
    })

    await prismaService.product.createMany({
      data: entities.map(item => item.toJSON()),
    })

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect({
      ...output,
      items: output.items.map(item => ({
        ...item,
        updatedAt: null,
      })),
    }).toMatchObject({
      items: [
        {
          ...entities[0].toJSON(),
          updatedAt: null,
        },
        {
          ...entities[4].toJSON(),
          updatedAt: null,
        },
      ],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    })

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect({
      ...output,
      items: output.items.map(item => ({
        ...item,
        updatedAt: null,
      })),
    }).toMatchObject({
      items: [{ ...entities[2].toJSON(), updatedAt: null }],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    })
  })
})
