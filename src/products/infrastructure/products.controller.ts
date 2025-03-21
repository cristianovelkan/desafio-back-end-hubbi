import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common'
import { CreateProductDto } from './dtos/create-product.dto'
import { UpdateProductDto } from './dtos/update-product.dto'
import { CreateProductUseCase } from '../application/usecases/create-product.usecase'
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase'
import { DeleteProductUseCase } from '../application/usecases/delete-product.usecase'
import { GetProductUseCase } from '../application/usecases/get-product.usecase'
import { ListProductsUseCase } from '../application/usecases/list-products.usecase'
import { ListProductsDto } from './dtos/list-products.dto'
import { ProductOutput } from '../application/dtos/product-output'
import { ProductPresenter } from './presenters/product.presenter'

@Controller('products')
export class ProductsController {
  @Inject(CreateProductUseCase.UseCase)
  private createproductUseCase: CreateProductUseCase.UseCase

  @Inject(UpdateProductUseCase.UseCase)
  private updateProductUseCase: UpdateProductUseCase.UseCase

  @Inject(DeleteProductUseCase.UseCase)
  private deleteProductUseCase: DeleteProductUseCase.UseCase

  @Inject(GetProductUseCase.UseCase)
  private getProductUseCase: GetProductUseCase.UseCase

  @Inject(ListProductsUseCase.UseCase)
  private listProductsUseCase: ListProductsUseCase.UseCase

  static productToResponse(output: ProductOutput) {
    return new ProductPresenter(output)
  }

  @Post()
  async create(@Body() createproductDto: CreateProductDto) {
    const output = await this.createproductUseCase.execute(createproductDto)
    return ProductsController.productToResponse(output)
  }

  @HttpCode(200)
  @Get()
  async search(@Query() searchParams: ListProductsDto) {
    return this.listProductsUseCase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getProductUseCase.execute({ id })
    return ProductsController.productToResponse(output)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const output = await this.updateProductUseCase.execute({
      id,
      ...updateProductDto,
    })
    return ProductsController.productToResponse(output)
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteProductUseCase.execute({ id })
  }
}
