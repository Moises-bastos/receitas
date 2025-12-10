"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CategoryService_1 = require("../../application/services/CategoryService");
const RecipeService_1 = require("../../application/services/RecipeService");
const IngredientService_1 = require("../../application/services/IngredientService");
const container_1 = require("../../infrastructure/di/container");
const categories_1 = require("./routes/categories");
const recipes_1 = require("./routes/recipes");
const ingredients_1 = require("./routes/ingredients");
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const categoryService = container_1.container.get(CategoryService_1.CategoryService);
const recipeService = container_1.container.get(RecipeService_1.RecipeService);
const ingredientService = container_1.container.get(IngredientService_1.IngredientService);
app.use("/categories", (0, categories_1.categoriesRoutes)(categoryService));
app.use("/recipes", (0, recipes_1.recipesRoutes)(recipeService));
app.use("/ingredients", (0, ingredients_1.ingredientsRoutes)(ingredientService));
app.use(errorHandler_1.errorHandler);
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
    process.stdout.write(`server running on http://localhost:${port}\n`);
});
