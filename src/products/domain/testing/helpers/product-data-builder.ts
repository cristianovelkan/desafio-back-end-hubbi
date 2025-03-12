import { faker } from '@faker-js/faker'
import { ProductProps } from '../../entities/product.entity'
type Props = {
  name?: string
  sku?: string
  stock?: number
  price?: number
  createdAt?: Date
  updatedAt?: Date
}
export function ProductDataBuilder(props: Props): ProductProps {
  return {
    name: props.name ?? faker.person.fullName(),
    sku: props.sku ?? faker.commerce.isbn(10),
    stock: props.stock ?? faker.number.int({ min: 10, max: 100 }),
    price:
      props.price ??
      faker.number.float({ multipleOf: 0.25, min: 100, max: 500 }),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  }
}
