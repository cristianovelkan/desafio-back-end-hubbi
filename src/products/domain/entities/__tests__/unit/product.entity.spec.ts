/* eslint-disable @typescript-eslint/unbound-method */
import { ProductEntity, ProductProps } from '../../product.entity'
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
describe('ProductEntity unit tests', () => {
  let props: ProductProps
  let sut: ProductEntity
  beforeEach(() => {
    ProductEntity.validate = jest.fn()
    props = ProductDataBuilder({})
    sut = new ProductEntity(props)
  })
  it('Constructor method', () => {
    expect(ProductEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.sku).toEqual(props.sku)
    expect(sut.props.stock).toEqual(props.stock)
    expect(sut.props.price).toEqual(props.price)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
    expect(sut.props.updatedAt).toBeInstanceOf(Date)
  })

  it('Name getter', () => {
    expect(sut.props.name).toBeDefined()
    expect(sut.props.name).toEqual(props.name)
    expect(typeof sut.props.name).toBe('string')
  })

  it('Name Setter', () => {
    sut['name'] = 'other name'
    expect(sut.props.name).toEqual('other name')
    expect(typeof sut.props.name).toBe('string')
  })

  it('Sku getter', () => {
    expect(sut.props.sku).toBeDefined()
    expect(sut.props.sku).toEqual(props.sku)
    expect(typeof sut.props.sku).toBe('string')
  })

  it('Stock getter', () => {
    expect(sut.props.stock).toBeDefined()
    expect(sut.props.stock).toEqual(props.stock)
    expect(typeof sut.props.stock).toBe('number')
  })

  it('Price getter', () => {
    expect(sut.props.price).toBeDefined()
    expect(sut.props.price).toEqual(props.price)
    expect(typeof sut.props.price).toBe('number')
  })

  it('CreatedAt getter', () => {
    expect(sut.props.createdAt).toBeDefined()
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('UpdatedAt getter', () => {
    expect(sut.props.updatedAt).toBeDefined()
    expect(sut.props.updatedAt).toBeInstanceOf(Date)
  })

  it('Should update a product', () => {
    const newProps = ProductDataBuilder({
      name: 'new name',
      sku: 'new sku',
      stock: 85,
      price: 54.2,
    })
    expect(ProductEntity.validate).toHaveBeenCalled()
    sut.update(newProps)
    expect(sut.props.name).toEqual(newProps.name)
    expect(sut.props.sku).toEqual(newProps.sku)
    expect(sut.props.stock).toEqual(newProps.stock)
    expect(sut.props.price).toEqual(newProps.price)
    expect(sut.props.updatedAt).toBeInstanceOf(Date)
  })
})
