import { ProductOutput } from '@/products/application/dtos/product-output'
import { Transform } from 'class-transformer'

export class ProductPresenter {
  id: string
  name: string
  sku: string
  stock: number
  price: number
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date

  constructor(output: ProductOutput) {
    this.id = output.id
    this.name = output.name
    this.sku = output.sku
    this.stock = output.stock
    this.price = output.price
    this.createdAt = output.createdAt
    this.updatedAt = output.updatedAt
  }
}
