export type ProductProps = {
  name: string;
  sku: string;
  stock: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};
export class ProductEntity {
  constructor(public readonly props: ProductProps) {
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.updatedAt = new Date();
  }
}
