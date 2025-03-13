import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dtos/create-product.dto'
import { UpdateProductDto } from './dtos/update-product.dto'

@Injectable()
export class ProductsService {
  create(_createProductDto: CreateProductDto) {
    return 'This action adds a new product'
  }

  findAll() {
    return `This action returns all products`
  }

  findOne(id: number) {
    return `This action returns a #${id} product`
  }

  update(id: number, _updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
