import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository'
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { BadRequestError } from '@/products/application/errors/bad-request-error'

describe('CreateProductUseCase unit tests', () => {
  let sut: CreateProductUseCase.UseCase
  let repository: ProductInMemoryRepository

  beforeEach(() => {
    repository = new ProductInMemoryRepository()
    sut = new CreateProductUseCase.UseCase(repository)
  })

  it('Should create a product', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = ProductDataBuilder({})
    const result = await sut.execute({
      name: props.name,
      price: props.price,
      sku: props.sku,
      stock: props.stock,
    })
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should not be able to register with same sku twice', async () => {
    const props = ProductDataBuilder({ sku: 'abc12345' })
    await sut.execute(props)

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should throws error when name not provided', async () => {
    const props = Object.assign(ProductDataBuilder({}), { name: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when sku not provided', async () => {
    const props = Object.assign(ProductDataBuilder({}), { sku: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when price not provided', async () => {
    const props = Object.assign(ProductDataBuilder({}), { price: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when stock not provided', async () => {
    const props = Object.assign(ProductDataBuilder({}), { stock: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
