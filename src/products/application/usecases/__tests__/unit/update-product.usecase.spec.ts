import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { UpdateProductUseCase } from '../../update-product.usecase'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('UpdateProductUseCase unit tests', () => {
  let sut: UpdateProductUseCase.UseCase
  let repository: ProductInMemoryRepository

  beforeEach(() => {
    repository = new ProductInMemoryRepository()
    sut = new UpdateProductUseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        name: 'test name',
        sku: '',
        stock: '',
        price: 0,
      }),
    ).rejects.toThrow(new NotFoundError('NotFoundError: Entity not found'))
  })

  it('Should throws error when name not provided', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        name: '',
        sku: '',
        stock: '',
        price: 0,
      }),
    ).rejects.toThrow(new BadRequestError('Name not provided'))
  })

  it('Should update a product', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new ProductEntity(ProductDataBuilder({}))]
    repository.items = items

    const result = await sut.execute({
      id: items[0]._id,
      name: 'new name',
      sku: 'new sku',
      stock: '10',
      price: 10,
    })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new name',
      price: 10,
      stock: 10,
      sku: 'new sku',
      createdAt: items[0].createdAt,
    })
  })
})
