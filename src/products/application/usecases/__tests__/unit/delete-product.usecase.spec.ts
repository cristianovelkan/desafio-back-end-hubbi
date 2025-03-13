import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { DeleteProductUseCase } from '../../delete-product.usecase'

describe('DeleteProductUseCase unit tests', () => {
  let sut: DeleteProductUseCase.UseCase
  let repository: ProductInMemoryRepository

  beforeEach(() => {
    repository = new ProductInMemoryRepository()
    sut = new DeleteProductUseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('NotFoundError: Entity not found'),
    )
  })

  it('Should delete a product', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const items = [new ProductEntity(ProductDataBuilder({}))]
    repository.items = items

    expect(repository.items).toHaveLength(1)
    await sut.execute({ id: items[0]._id })
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items).toHaveLength(0)
  })
})
