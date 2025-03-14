import { ProductsController } from '../../products.controller'
import { ProductOutput } from '@/products/application/dtos/product-output'
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'
import { CreateProductDto } from '../../dtos/create-product.dto'
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase'
import { UpdateProductDto } from '../../dtos/update-product.dto'
import { GetProductUseCase } from '@/products/application/usecases/get-product.usecase'
import { ListProductsUseCase } from '@/products/application/usecases/list-products.usecase'
import { ProductPresenter } from '../../presenters/product.presenter'

describe('ProductsController unit tests', () => {
  let sut: ProductsController
  let id: string
  let props: ProductOutput

  beforeEach(() => {
    sut = new ProductsController()
    id = 'df96ae94-6128-486e-840c-b6f78abb4801'
    props = {
      id,
      name: 'Banana',
      sku: 'abc123456',
      stock: 10,
      price: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a product', async () => {
    const output: CreateProductUseCase.Output = props
    const mockCreateProductUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['createproductUseCase'] = mockCreateProductUseCase as any
    const input: CreateProductDto = {
      name: 'Banana',
      sku: 'abc123456',
      stock: 10,
      price: 10,
    }
    const presenter = await sut.create(input)
    expect(presenter).toBeInstanceOf(ProductPresenter)
    expect(presenter).toStrictEqual(new ProductPresenter(output))
    expect(mockCreateProductUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a product', async () => {
    const output: UpdateProductUseCase.Output = props
    const mockUpdateProductUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updateProductUseCase'] = mockUpdateProductUseCase as any
    const input: UpdateProductDto = {
      name: 'new name',
      sku: 'new sku',
      stock: 20,
      price: 20,
    }
    const presenter = await sut.update(id, input)
    expect(presenter).toBeInstanceOf(ProductPresenter)
    expect(presenter).toStrictEqual(new ProductPresenter(output))
    expect(mockUpdateProductUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('should delete a product', async () => {
    const output = undefined
    const mockDeleteProductUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['deleteProductUseCase'] = mockDeleteProductUseCase as any
    const result = await sut.remove(id)
    expect(output).toStrictEqual(result)
    expect(mockDeleteProductUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should gets a product', async () => {
    const output: GetProductUseCase.Output = props
    const mockGetProductUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['getProductUseCase'] = mockGetProductUseCase as any
    const presenter = await sut.findOne(id)
    expect(presenter).toBeInstanceOf(ProductPresenter)
    expect(presenter).toStrictEqual(new ProductPresenter(output))
    expect(mockGetProductUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should list products', async () => {
    const output: ListProductsUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockListProductsUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['listProductsUseCase'] = mockListProductsUseCase as any
    const searchParams = {
      page: 1,
      perPage: 1,
    }
    const result = await sut.search(searchParams)
    expect(output).toStrictEqual(result)
    expect(mockListProductsUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
