import { Category } from "../entities/Category"

export type CreateCategoryDTO = {
  id: string
  name: string
  createdAt: Date
}

export interface ICategoryRepository {
  list(): Promise<Category[]>
  findById(id: string): Promise<Category | undefined>
  findByName(name: string): Promise<Category | undefined>
  create(data: CreateCategoryDTO): Promise<Category>
  update(id: string, data: Partial<CreateCategoryDTO>): Promise<Category>
  delete(id: string): Promise<void>
}
