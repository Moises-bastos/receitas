import { randomUUID } from "crypto"
import { Category } from "./entities/Category"
import { Ingredient } from "./entities/Ingredient"
import { Recipe } from "./entities/Recipe"

export function createCategory(input: { name: string }): Category {
  const name = input.name.trim()
  return {
    id: randomUUID(),
    name,
    createdAt: new Date(),
  }
}

export function createIngredient(input: { name: string }): Ingredient {
  const name = input.name.trim()
  return {
    id: randomUUID(),
    name,
    createdAt: new Date(),
  }
}

export function createRecipe(input: {
  title: string
  description?: string
  ingredients: string[]
  steps: string[]
  categoryId: string
}): Recipe {
  const title = input.title.trim()
  return {
    id: randomUUID(),
    title,
    description: input.description,
    ingredients: [...input.ingredients],
    steps: [...input.steps],
    categoryId: input.categoryId,
    createdAt: new Date(),
  }
}
