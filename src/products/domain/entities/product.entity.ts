import { Entity } from '@/shared/domain/entities/entity'
import { ProductValidatorFactory } from '../validators/product.validator'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

export type ProductProps = {
  name: string
  sku: string
  stock: number
  price: number
  createdAt?: Date
  updatedAt?: Date
}
export class ProductEntity extends Entity<ProductProps> {
  constructor(
    public readonly props: ProductProps,
    id?: string,
  ) {
    ProductEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
    this.props.updatedAt = new Date()
  }

  update(data: Partial<ProductProps>): void {
    ProductEntity.validate({ ...this.props, ...data })
    Object.assign(this.props, data)
    this.props.updatedAt = new Date()
  }

  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get sku(): string {
    return this.props.sku
  }

  set sku(value: string) {
    this.props.sku = value
  }

  get stock(): number {
    return this.props.stock
  }

  set stock(value: number) {
    this.props.stock = value
  }

  get price(): number {
    return this.props.price
  }

  set price(value: number) {
    this.props.price = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  static validate(props: ProductProps) {
    const validator = ProductValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
