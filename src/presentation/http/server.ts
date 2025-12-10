import express from "express"
import { CategoryService } from "../../application/services/CategoryService"
import { RecipeService } from "../../application/services/RecipeService"
import { IngredientService } from "../../application/services/IngredientService"
import { container } from "../../infrastructure/di/container"
import { categoriesRoutes } from "./routes/categories"
import { recipesRoutes } from "./routes/recipes"
import { ingredientsRoutes } from "./routes/ingredients"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()
app.use(express.json())

const categoryService = container.get(CategoryService)
const recipeService = container.get(RecipeService)
const ingredientService = container.get(IngredientService)

app.use("/categories", categoriesRoutes(categoryService))
app.use("/recipes", recipesRoutes(recipeService))
app.use("/ingredients", ingredientsRoutes(ingredientService))
app.use(errorHandler)

const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => {
  process.stdout.write(`server running on http://localhost:${port}\n`)
})

