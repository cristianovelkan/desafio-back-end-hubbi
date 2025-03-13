import { ProductEntity } from '@/products/domain/entities/product.entity'
import { ProductInMemoryRepository } from '../../product-in-memory.repository'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('ProductInMemoryRepository unit tests', () => {
  let sut: ProductInMemoryRepository

  beforeEach(() => {
    sut = new ProductInMemoryRepository()
  })

  it('Should throw error when not found - findBySku method', async () => {
    await expect(sut.findBySku('abc12345')).rejects.toThrow(
      new NotFoundError('Entity not found using sku abc12345'),
    )
  })

  it('Should find a entity by sku - findBySku method', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findBySku(entity.sku)
    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should throw error when not found - skuExists method', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await sut.insert(entity)
    await expect(sut.skuExists(entity.sku)).rejects.toThrow(
      new ConflictError('Sku already used'),
    )
  })

  it('Should find a entity by sku - skuExists method', async () => {
    expect.assertions(0)
    await sut.skuExists('abc12345')
  })

  it('Should not filter items when filter object is null', async () => {
    const entity = new ProductEntity(ProductDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, null)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field using filter param', async () => {
    const items = [
      new ProductEntity(ProductDataBuilder({ name: 'Test' })),
      new ProductEntity(ProductDataBuilder({ name: 'TEST' })),
      new ProductEntity(ProductDataBuilder({ name: 'fake' })),
    ]
    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'TEST')
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })
})
