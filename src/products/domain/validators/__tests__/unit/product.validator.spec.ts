import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import {
  ProductRules,
  ProductValidator,
  ProductValidatorFactory,
} from '../../product.validator'
import { ProductProps } from '@/products/domain/entities/product.entity'
let sut: ProductValidator
let props: ProductProps
describe('ProductValidator unit tests', () => {
  beforeEach(() => {
    sut = ProductValidatorFactory.create()
    props = ProductDataBuilder({})
  })

  it('Valid case for product rules', () => {
    const isValid = sut.validate(props)
    expect(isValid).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new ProductRules(props))
  })

  it('Invalidation cases for name field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ])

    isValid = sut.validate({ ...props, name: '' })
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

    isValid = sut.validate({ ...props, name: 10 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ])

    isValid = sut.validate({ ...props, name: 'a'.repeat(256) })
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name must be shorter than or equal to 255 characters',
    ])
  })

  it('Invalidation cases for sku field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['sku']).toStrictEqual([
      'sku should not be empty',
      'sku must be a string',
      'sku must be shorter than or equal to 255 characters',
    ])

    isValid = sut.validate({ ...props, sku: '' })
    expect(isValid).toBeFalsy()
    expect(sut.errors['sku']).toStrictEqual(['sku should not be empty'])

    isValid = sut.validate({ ...props, sku: 10 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['sku']).toStrictEqual([
      'sku must be a string',
      'sku must be shorter than or equal to 255 characters',
    ])

    isValid = sut.validate({ ...props, sku: 'a'.repeat(256) })
    expect(isValid).toBeFalsy()
    expect(sut.errors['sku']).toStrictEqual([
      'sku must be shorter than or equal to 255 characters',
    ])
  })

  it('Invalidation cases for stock field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['stock']).toStrictEqual([
      'stock must be a positive number',
      'stock must be an integer number',
      'stock must be a number conforming to the specified constraints',
      'stock should not be empty',
    ])

    isValid = sut.validate({ ...props, stock: 10.5 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['stock']).toStrictEqual([
      'stock must be an integer number',
    ])

    isValid = sut.validate({ ...props, stock: -10 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['stock']).toStrictEqual([
      'stock must be a positive number',
    ])
  })

  it('Invalidation cases for price field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['price']).toStrictEqual([
      'price must be a positive number',
      'price must be a number conforming to the specified constraints',
      'price should not be empty',
    ])

    isValid = sut.validate({ ...props, price: '10' as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['price']).toStrictEqual([
      'price must be a positive number',
      'price must be a number conforming to the specified constraints',
    ])

    isValid = sut.validate({ ...props, price: -10 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['price']).toStrictEqual([
      'price must be a positive number',
    ])
  })

  it('Invalidation cases for createdAt field', () => {
    let isValid = sut.validate({ ...props, createdAt: 10 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ])
    isValid = sut.validate({ ...props, createdAt: '2023' as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ])
  })
})
