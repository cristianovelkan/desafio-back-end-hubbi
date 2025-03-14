import { PrismaClient } from '@prisma/client'
import { ProductPrismaRepository } from '../../product-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

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
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('ProductModel not found using ID FakeId'),
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

  it('should throws error on update when a entity not found', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`ProductModel not found using ID ${entity._id}`),
    )
  })

  it('should update a entity', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    const newProduct = await prismaService.product.create({
      data: entity.toJSON(),
    })
    entity.update({ ...newProduct, name: 'new name' })
    await sut.update(entity)

    const output = await prismaService.product.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output.name).toBe('new name')
  })

  it('should throws error on delete when a entity not found', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await expect(() => sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`ProductModel not found using ID ${entity._id}`),
    )
  })

  it('should delete a entity', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await prismaService.product.create({
      data: entity.toJSON(),
    })
    await sut.delete(entity._id)

    const output = await prismaService.product.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output).toBeNull()
  })

  it('should throws error when a entity not found', async () => {
    await expect(() => sut.findBySku('abc123456')).rejects.toThrow(
      new NotFoundError(`ProductModel not found using sku abc123456`),
    )
  })

  it('should finds a entity by sku', async () => {
    const entity = new ProductEntity(ProductDataBuilder({ sku: 'abc123456' }))
    await prismaService.product.create({
      data: entity.toJSON(),
    })
    const output = await sut.findBySku('abc123456')

    expect({ ...output.toJSON(), updatedAt: null }).toStrictEqual({
      ...entity.toJSON(),
      updatedAt: null,
    })
  })

  it('should throws error when a entity found by sku', async () => {
    const entity = new ProductEntity(ProductDataBuilder({ sku: 'abc123456' }))
    await prismaService.product.create({
      data: entity.toJSON(),
    })

    await expect(() => sut.skuExists('abc123456')).rejects.toThrow(
      new ConflictError(`Sku already used`),
    )
  })

  it('should not finds a entity by sku', async () => {
    expect.assertions(0)
    await sut.skuExists('abc123456')
  })

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: ProductEntity[] = []
      const arrange = Array(20).fill(ProductDataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new ProductEntity({
            ...element,
            name: `Product${index}`,
            sku: `sku${index}`,
            stock: index + 1,
            price: index + 1,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.product.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutput = await sut.search(
        new ProductRepository.SearchParams(),
      )
      const items = searchOutput.items

      expect(searchOutput).toBeInstanceOf(ProductRepository.SearchResult)
      expect(searchOutput.total).toBe(20)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(ProductEntity)
      })
      items.reverse().forEach((item, index) => {
        expect(`sku${index + 5}`).toBe(item.sku)
      })
    })

    it('should search using filter, sort and paginate', async () => {
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

      const searchOutputPage1 = await sut.search(
        new ProductRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect({
        ...searchOutputPage1.items[0].toJSON(),
        updatedAt: null,
      }).toMatchObject({ ...entities[0].toJSON(), updatedAt: null })
      expect({
        ...searchOutputPage1.items[1].toJSON(),
        updatedAt: null,
      }).toMatchObject({ ...entities[4].toJSON(), updatedAt: null })

      const searchOutputPage2 = await sut.search(
        new ProductRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect({
        ...searchOutputPage2.items[0].toJSON(),
        updatedAt: null,
      }).toMatchObject({ ...entities[2].toJSON(), updatedAt: null })
    })
  })
})
