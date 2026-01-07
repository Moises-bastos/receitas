import express from "express"
import { RecipeService } from "../../core/RecipeService.js"

const app = express()
app.use(express.json())

const recipeService = new RecipeService()

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

app.post("/recipes", async (req, res) => {
  try {
    const recipe = await recipeService.create(req.body)
    res.status(201).json(recipe)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

app.get("/recipes/:id/scale", async (req, res) => {
  try {
    const servings = Number(req.query.servings)
    const recipe = await recipeService.scaleRecipe(req.params.id, servings)
    res.json(recipe)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

app.listen(3333, () => {
  console.log("🚀 Server running on http://localhost:3333")
})
app.post("/recipes/shopping-list", async (req, res) => {
  try {
    const { recipeIds } = req.body

    const list = await recipeService.generateShoppingList(recipeIds)

    res.json(list)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})
        

