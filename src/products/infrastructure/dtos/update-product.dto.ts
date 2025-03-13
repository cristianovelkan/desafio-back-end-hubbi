import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase'

export class UpdateProductDto
  implements Omit<UpdateProductUseCase.Input, 'id'>
{
  name: string
  sku: string
  stock: number
  price: number
}
