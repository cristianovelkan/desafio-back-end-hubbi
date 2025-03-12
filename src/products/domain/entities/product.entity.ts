export type ProductProps = {
  name: string
  sku: string
  stock: number
  price: number
  createdAt?: Date
  updatedAt?: Date
}
export class ProductEntity {
  constructor(public readonly props: ProductProps) {
    this.props.createdAt = this.props.createdAt ?? new Date()
    this.props.updatedAt = new Date()
  }

  get name(): string {
    return this.props.name
  }

  get sku(): string {
    return this.props.sku
  }

  get stock(): number {
    return this.props.stock
  }

  get price(): number {
    return this.props.price
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
