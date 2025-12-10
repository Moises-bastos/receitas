import { Ingredient } from "../entities/Ingredient"

export type CreateIngredientDTO = {
  id: string
  name: string
  createdAt: Date
}

export interface IIngredientRepository {
  list(): Promise<Ingredient[]>
  findById(id: string): Promise<Ingredient | undefined>
  findByName(name: string): Promise<Ingredient | undefined>
  create(data: CreateIngredientDTO): Promise<Ingredient>
  update(id: string, data: Partial<CreateIngredientDTO>): Promise<Ingredient>
  delete(id: string): Promise<void>
}
