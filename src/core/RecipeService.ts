import crypto from "node:crypto"
import { store } from "./store.js"
import { Recipe, CreateRecipeInput } from "./models.js"
import { CategoryService } from "./CategoryService.js"
import { IngredientService } from "./IngredientService.js"
import { IRecipeService } from "./interfaces/IRecipeService.js"

export class RecipeService implements IRecipeService {
  private categoryService = new CategoryService()
  private ingredientService = new IngredientService()

  async scaleRecipe(recipeId: string, desiredServings: number) {
    if (!(desiredServings > 0)) {
      throw new Error("Desired servings must be greater than 0")
    }

    const recipe = store.recipes.find(r => r.id === recipeId)
    if (!recipe) {
      throw new Error("Recipe not found")
    }

    const factor = desiredServings / recipe.servings

    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      servings: desiredServings,
      ingredients: recipe.ingredients.map(ingredient => ({
        ingredientId: ingredient.ingredientId,
        unit: ingredient.unit,
        quantity: ingredient.quantity * factor
      }))
    }
  }

  async generateShoppingList(recipeIds: string[]) {
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      throw new Error("Recipe IDs are required")
    }

    const recipes = recipeIds.map(id => {
      const recipe = store.recipes.find(r => r.id === id)
      if (!recipe) {
        throw new Error(`Recipe not found: ${id}`)
      }
      return recipe
    })

    const consolidated = new Map<
      string,
      { ingredientId: string; unit: string; quantity: number }
    >()

    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients) {
        const key = `${ingredient.ingredientId}-${ingredient.unit}`

        if (!consolidated.has(key)) {
          consolidated.set(key, { ...ingredient })
        } else {
          consolidated.get(key)!.quantity += ingredient.quantity
        }
      }
    }

    return Array.from(consolidated.values())
  }

  async list(filter?: { categoryId?: string; categoryName?: string; search?: string }): Promise<Recipe[]> {
    let categoryId = filter?.categoryId

    if (filter?.categoryName) {
      const category = await this.categoryService.findByName(filter.categoryName.trim())
      if (!category) return []
      categoryId = category.id
    }

    let items = store.recipes.filter(r => r.status === "published")

    if (categoryId) {
      items = items.filter(r => r.categoryId === categoryId)
    }

    if (filter?.search) {
      const searchQuery = filter.search.trim().toLowerCase()
      const allIngredients = await this.ingredientService.list()
      const nameById = new Map(allIngredients.map(i => [i.id, i.name.toLowerCase()]))

      items = items.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery) ||
        recipe.description?.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.some(i => nameById.get(i.ingredientId)?.includes(searchQuery))
      )
    }

    return items
  }

  async get(id: string): Promise<Recipe> {
    const found = store.recipes.find(r => r.id === id)
    if (!found) throw new Error("Recipe not found")
    return found
  }

  async create(input: CreateRecipeInput): Promise<Recipe> {
    const title = input.title.trim()
    if (!title) throw new Error("Title is required")

    const category = await this.categoryService.get(input.categoryId).catch(() => null)
    if (!category) throw new Error("Category does not exist")

    const incoming = input.ingredients ?? []
    if (incoming.length === 0) throw new Error("Ingredients are required")

    const resolved = []

    for (const i of incoming) {
      if (!i.name || !(i.quantity > 0) || !i.unit) {
        throw new Error("Invalid ingredient")
      }

      const existing = await this.ingredientService.findByName(i.name)
      const ingredient = existing ?? await this.ingredientService.create({ name: i.name })

      resolved.push({
        ingredientId: ingredient.id,
        quantity: i.quantity,
        unit: i.unit
      })
    }

    const servings = Number(input.servings)
    if (!(servings > 0)) throw new Error("Servings must be greater than 0")

    const recipe: Recipe = {
      id: crypto.randomUUID(),
      title,
      description: input.description,
      ingredients: resolved,
      steps: input.steps ?? [],
      servings,
      categoryId: input.categoryId,
      status: "draft",
      createdAt: new Date()
    }

    store.recipes.push(recipe)
    return recipe
  }

  async update(id: string, data: Partial<CreateRecipeInput>): Promise<Recipe> {
    const recipe = store.recipes.find(r => r.id === id)
    if (!recipe) throw new Error("Recipe not found")
    if (recipe.status === "archived") throw new Error("Archived recipes cannot be edited")

    Object.assign(recipe, data)
    return recipe
  }

  async delete(id: string): Promise<void> {
    const idx = store.recipes.findIndex(r => r.id === id)
    if (idx < 0) return

    if (store.recipes[idx].status === "published") {
      throw new Error("Published recipes cannot be deleted")
    }

    store.recipes.splice(idx, 1)
  }
}


