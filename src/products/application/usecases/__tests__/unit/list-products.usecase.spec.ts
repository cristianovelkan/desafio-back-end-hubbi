import { ProductInMemoryRepository } from '@/products/infrastructure/database/in-memory/repositories/product-in-memory.repository'
import { ListProductsUseCase } from '../../list-products.usecase'
import { ProductRepository } from '@/products/domain/repositories/product.repository'
import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'

describe('ListProductsUseCase unit tests', () => {
  let sut: ListProductsUseCase.UseCase
  let repository: ProductInMemoryRepository

  beforeEach(() => {
    repository = new ProductInMemoryRepository()
    sut = new ListProductsUseCase.UseCase(repository)
  })

  it('toOutput method', () => {
    let result = new ProductRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    let output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })

    const entity = new ProductEntity(ProductDataBuilder({}))
    result = new ProductRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })
  })

  it('should return the products ordered by createdAt', async () => {
    const createdAt = new Date()
    const items = [
      new ProductEntity(ProductDataBuilder({ createdAt })),
      new ProductEntity(
        ProductDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ]
    repository.items = items
    const output = await sut.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    })
  })

  it('should return the products using pagination, sort and filter by name', async () => {
    const items = [
      new ProductEntity(ProductDataBuilder({ name: 'a' })),
      new ProductEntity(ProductDataBuilder({ name: 'AA' })),
      new ProductEntity(ProductDataBuilder({ name: 'Aa' })),
      new ProductEntity(ProductDataBuilder({ name: 'b' })),
      new ProductEntity(ProductDataBuilder({ name: 'c' })),
    ]
    repository.items = items
    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON(), items[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    })
  })

  it('should return the products using pagination and sort by price', async () => {
    const items = [
      new ProductEntity(ProductDataBuilder({ price: 1 })),
      new ProductEntity(ProductDataBuilder({ price: 5 })),
      new ProductEntity(ProductDataBuilder({ price: 4 })),
      new ProductEntity(ProductDataBuilder({ price: 3 })),
      new ProductEntity(ProductDataBuilder({ price: 2 })),
    ]
    repository.items = items
    const output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'price',
      sortDir: 'asc',
    })
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[4].toJSON()],
      total: 5,
      currentPage: 1,
      lastPage: 3,
      perPage: 2,
    })
  })
})
