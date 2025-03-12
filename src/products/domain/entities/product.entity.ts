export type ProductProps = {
  name?: string
  sku?: string
  stock?: number
  price?: number
  createdAt?: Date
  updatedAt?: Date
}
export class ProductEntity {
  constructor(public readonly props: ProductProps) {
    this.props.createdAt = this.props.createdAt ?? new Date()
    this.props.updatedAt = new Date()
  }

  update(data: Partial<ProductProps>): void {
    Object.assign(this.props, data)
    this.props.updatedAt = new Date()
  }

  get name(): string {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  get sku(): string {
    return this.props.sku
  }

  private set sku(value: string) {
    this.props.sku = value
  }

  get stock(): number {
    return this.props.stock
  }

  private set stock(value: number) {
    this.props.stock = value
  }

  get price(): number {
    return this.props.price
  }

  private set price(value: number) {
    this.props.price = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
