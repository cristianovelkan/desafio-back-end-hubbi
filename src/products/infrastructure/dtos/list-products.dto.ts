import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'
import { ListProductsUseCase } from '@/products/application/usecases/list-products.usecase'

export class ListProductsDto implements ListProductsUseCase.Input {
  page?: number
  perPage?: number
  sort?: string
  sortDir?: SortDirection
  filter?: string
}
