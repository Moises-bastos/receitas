import { Recipe } from "../entities/Recipe"

export type CreateRecipeDTO = {
  id: string
  title: string
  description?: string
  ingredients: string[]
  steps: string[]
  categoryId: string
  createdAt: Date
}

export interface IRecipeRepository {
  list(): Promise<Recipe[]>
  listByCategoryId(categoryId: string): Promise<Recipe[]>
  findById(id: string): Promise<Recipe | undefined>
  create(data: CreateRecipeDTO): Promise<Recipe>
  update(id: string, data: Partial<CreateRecipeDTO>): Promise<Recipe>
  delete(id: string): Promise<void>
}
