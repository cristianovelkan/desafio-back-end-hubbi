import { instanceToPlain } from 'class-transformer'
import { ProductPresenter } from '../../product.presenter'

describe('ProductPresenter unit tests', () => {
  const createdAt = new Date()
  const updatedAt = new Date()
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    sku: 'test sku',
    stock: 10,
    price: 10,
    createdAt,
    updatedAt,
  }

  let sut: ProductPresenter

  beforeEach(() => {
    sut = new ProductPresenter(props)
  })

  describe('constructor', () => {
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.sku).toEqual(props.sku)
      expect(sut.stock).toEqual(props.stock)
      expect(sut.price).toEqual(props.price)
      expect(sut.createdAt).toEqual(props.createdAt)
      expect(sut.updatedAt).toEqual(props.updatedAt)
    })
  })

  it('should present data', () => {
    const output = instanceToPlain(sut)
    expect(output).toStrictEqual({
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      name: 'test name',
      sku: 'test sku',
      stock: 10,
      price: 10,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    })
  })
})
