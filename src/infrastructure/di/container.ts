import { CategoryMemoryRepository } from "../repositories/memory/CategoryMemoryRepository"
import { RecipeMemoryRepository } from "../repositories/memory/RecipeMemoryRepository"
import { CategoryService } from "../../application/services/CategoryService"
import { RecipeService } from "../../application/services/RecipeService"
import { IngredientService } from "../../application/services/IngredientService"
import { IngredientMemoryRepository } from "../repositories/memory/IngredientMemoryRepository"

type Token<T = unknown> = string | symbol | { new (...args: any[]): T }

type Factory<T> = (c: Container) => T

class Container {
  private factories = new Map<Token, Factory<any>>()
  private instances = new Map<Token, any>()

  registerSingleton<T>(token: Token<T>, factory: Factory<T>) {
    this.factories.set(token, factory)
  }

  get<T>(token: Token<T>): T {
    if (this.instances.has(token)) return this.instances.get(token)
    const factory = this.factories.get(token)
    if (!factory) throw new Error("Token not registered")
    const instance = factory(this)
    this.instances.set(token, instance)
    return instance
  }
}


const container = new Container()

container.registerSingleton("CategoryRepository", () => new CategoryMemoryRepository())
container.registerSingleton("RecipeRepository", () => new RecipeMemoryRepository())
container.registerSingleton("IngredientRepository", () => new IngredientMemoryRepository())

container.registerSingleton(CategoryService, (c) =>
  new CategoryService(c.get("CategoryRepository"), c.get("RecipeRepository"))
)

container.registerSingleton(RecipeService, (c) =>
  new RecipeService(c.get("RecipeRepository"), c.get("CategoryRepository"))
)

container.registerSingleton(IngredientService, (c) =>
  new IngredientService(c.get("IngredientRepository"))
)

export { container, Container }
