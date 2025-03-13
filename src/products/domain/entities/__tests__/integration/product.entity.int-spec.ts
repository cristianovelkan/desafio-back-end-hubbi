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

  it('Should be a valid product', () => {
    expect.assertions(0)
    const props: ProductProps = {
      ...ProductDataBuilder({}),
    }
    new ProductEntity(props)
  })

  describe('Update method', () => {
    it('Should throw an error when update a product with invalid name', () => {
      const entity = new ProductEntity(ProductDataBuilder({}))

      let newProps = {
        ...ProductDataBuilder({}),
        name: null,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        name: '',
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        name: 'a'.repeat(256),
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
    })

    it('Should throw an error when update a product with invalid sku', () => {
      const entity = new ProductEntity(ProductDataBuilder({}))

      let newProps = {
        ...ProductDataBuilder({}),
        sku: null,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        sku: '',
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        sku: 'a'.repeat(256),
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
    })

    it('Should throw an error when update a product with invalid stock', () => {
      const entity = new ProductEntity(ProductDataBuilder({}))

      let newProps = {
        ...ProductDataBuilder({}),
        stock: null,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        stock: -1,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        stock: 0,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        stock: 0.5,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
    })

    it('Should throw an error when update a product with invalid price', () => {
      const entity = new ProductEntity(ProductDataBuilder({}))

      let newProps = {
        ...ProductDataBuilder({}),
        price: null,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        price: -10,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        price: 0,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
      newProps = {
        ...ProductDataBuilder({}),
        price: '10' as any,
      }
      expect(() => entity.update(newProps)).toThrow(EntityValidationError)
    })

    it('Should be a valid product', () => {
      expect.assertions(0)
      const props: ProductProps = {
        ...ProductDataBuilder({}),
      }
      const entity = new ProductEntity(props)
      entity.update({
        ...props,
        name: 'new name',
        sku: 'new sku',
        stock: 10,
        price: 10,
      })
    })
  })
})
