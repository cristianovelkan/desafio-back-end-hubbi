import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'

export class CreateProductDto implements CreateProductUseCase.Input {
  name: string
  sku: string
  stock: number
  price: number
}
