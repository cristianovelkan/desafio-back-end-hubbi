/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import { ProductProps } from '../entities/product.entity'
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsPositive,
  IsNumber,
  MaxLength,
} from 'class-validator'
export class ProductRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  sku: string

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  stock: number

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({ name, sku, stock, price, createdAt }: ProductProps) {
    Object.assign(this, { name, sku, stock, price, createdAt })
  }
}
export class ProductValidator extends ClassValidatorFields<ProductRules> {
  validate(data: ProductRules): boolean {
    return super.validate(new ProductRules(data ?? ({} as ProductProps)))
  }
}
export class ProductValidatorFactory {
  static create(): ProductValidator {
    return new ProductValidator()
  }
}
