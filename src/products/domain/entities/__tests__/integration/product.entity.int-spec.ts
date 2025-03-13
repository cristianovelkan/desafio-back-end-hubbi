import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder'
import { ProductEntity, ProductProps } from '../../product.entity'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'
describe('ProductEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a product with invalid name', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        name: null,
      }
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

      props = {
        ...ProductDataBuilder({}),
        name: '',
      }
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

      props = {
        ...ProductDataBuilder({}),
        name: 'a'.repeat(256),
      }

      props = {
        ...ProductDataBuilder({}),
        name: 10 as any,
      }
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError)
    })

    it('Should throw an error when creating a product with invalid sku', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        sku: null,
      }
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

      props = {
        ...ProductDataBuilder({}),
        sku: '',
      }
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

      props = {
        ...ProductDataBuilder({}),
        sku: 'a'.repeat(256),
      }
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

      props = {
        ...ProductDataBuilder({}),
        sku: 10 as any,
      }
      expect(() => new ProductEntity(props)).toThrow(EntityValidationError)
    })
  })

  it('Should throw an error when creating a product with invalid stock', () => {
    let props: ProductProps = {
      ...ProductDataBuilder({}),
      stock: null,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

    props = {
      ...ProductDataBuilder({}),
      stock: -1,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

    props = {
      ...ProductDataBuilder({}),
      stock: 0,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

    props = {
      ...ProductDataBuilder({}),
      stock: 0.5,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)
  })

  it('Should throw an error when creating a product with invalid price', () => {
    let props: ProductProps = {
      ...ProductDataBuilder({}),
      price: null,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

    props = {
      ...ProductDataBuilder({}),
      price: -10,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

    props = {
      ...ProductDataBuilder({}),
      price: 0,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)

    props = {
      ...ProductDataBuilder({}),
      price: '10' as any,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)
  })

  it('Should throw an error when creating a product with invalid createdAt', () => {
    let props: ProductProps = {
      ...ProductDataBuilder({}),
      createdAt: '2023' as any,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)
    props = {
      ...ProductDataBuilder({}),
      createdAt: 10 as any,
    }
    expect(() => new ProductEntity(props)).toThrow(EntityValidationError)
  })
})
