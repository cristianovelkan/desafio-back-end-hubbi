import { Entity } from '../entities/entity'
import { NotFoundError } from '../errors/not-found-error'
import { RepositoryInterface } from './repository-contract'

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = []

  insert(entity: E): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.items.push(entity)
        resolve()
      } catch (error) {
        reject(Error(error))
      }
    })
  }

  findById(id: string): Promise<E> {
    return this._get(id)
  }

  findAll(): Promise<E[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.items)
      } catch (error) {
        reject(Error(error))
      }
    })
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id)
    const index = this.items.findIndex(item => item.id === entity.id)
    this.items[index] = entity
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    const index = this.items.findIndex(item => item.id === id)
    this.items.splice(index, 1)
  }

  protected _get(id: string): Promise<E> {
    return new Promise((resolve, reject) => {
      try {
        const _id = `${id}`
        const entity = this.items.find(item => item.id === _id)
        if (!entity) {
          throw new NotFoundError('Entity not found')
        }
        resolve(entity)
      } catch (error) {
        reject(Error(error))
      }
    })
  }
}
