import { PrismaClient, Product } from '@prisma/client'
import { ProductModelMapper } from '../../product-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('ProductModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.product.deleteMany()
    props = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      name: 'Test name',
      sku: 'Test sku',
      stock: 10,
      price: 10.5,
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throws error when product model is invalid', () => {
    const model: Product = Object.assign(props, { name: null })
    expect(() => ProductModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('should convert a product model to a product entity', async () => {
    const model: Product = await prismaService.product.create({
      data: props,
    })
    const sut = ProductModelMapper.toEntity(model)
    const now = new Date()
    expect(sut).toBeInstanceOf(ProductEntity)
    expect({ ...sut.toJSON(), updatedAt: now }).toStrictEqual({
      ...props,
      updatedAt: now,
    })
  })
})
