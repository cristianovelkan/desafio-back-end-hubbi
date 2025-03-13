import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository'
import { GetProductUseCase } from '../../get-product.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'

describe('GetProductUseCase unit tests', () => {
  let sut: GetProductUseCase.UseCase
  let repository: ProductInMemoryRepository

  beforeEach(() => {
    repository = new ProductInMemoryRepository()
    sut = new GetProductUseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('NotFoundError: Entity not found'),
    )
  })

  it('Should be able to get product', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const items = [new ProductEntity(ProductDataBuilder({}))]
    repository.items = items

    const result = await sut.execute({ id: items[0]._id })
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      price: items[0].price,
      stock: items[0].stock,
      sku: items[0].sku,
      createdAt: items[0].createdAt,
    })
  })
})
