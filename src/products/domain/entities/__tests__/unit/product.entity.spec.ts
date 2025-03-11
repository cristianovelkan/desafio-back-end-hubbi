/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { faker } from '@faker-js/faker';
import { ProductEntity, ProductProps } from '../../product.entity';
describe('ProductEntity unit tests', () => {
  let props: ProductProps;
  let sut: ProductEntity;
  beforeEach(() => {
    props = {
      name: faker.commerce.productName(),
      sku: faker.commerce.isbn(10),
      stock: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.float({ multipleOf: 0.25, min: 100, max: 500 }),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };
    sut = new ProductEntity(props);
  });
  it('Constructor method', () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.sku).toEqual(props.sku);
    expect(sut.props.stock).toEqual(props.stock);
    expect(sut.props.price).toEqual(props.price);
    expect(sut.props.createdAt).toEqual(props.createdAt);
    expect(sut.props.updatedAt).toEqual(props.updatedAt);
  });
});
