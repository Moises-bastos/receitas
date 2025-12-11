"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeService = void 0;
class RecipeService {
    constructor(recipes, categories) {
        this.recipes = recipes;
        this.categories = categories;
    }
    async create(input) {
        const title = input.title.trim();
        if (!title)
            throw new Error("Title is required");
        const category = await this.categories.findById(input.categoryId);
        if (!category)
            throw new Error("Category does not exist");
        const ingredients = Array.isArray(input.ingredients)
            ? input.ingredients.map((i) => ({
                name: String(i.name ?? "").trim(),
                quantity: Number(i.quantity ?? 0),
                unit: String(i.unit ?? "").trim(),
            }))
            : [];
        if (ingredients.length === 0)
            throw new Error("Ingredients are required");
        ingredients.forEach((i) => {
            if (!i.name)
                throw new Error("Ingredient name is required");
            if (!(i.quantity > 0))
                throw new Error("Ingredient quantity must be > 0");
            if (!i.unit)
                throw new Error("Ingredient unit is required");
        });
        const steps = Array.isArray(input.steps)
            ? input.steps.map((s) => String(s))
            : [];
        return this.recipes.create({
            title,
            description: input.description,
            ingredients,
            steps,
            categoryId: input.categoryId,
        });
    }
    async list(filter) {
        const items = filter?.categoryId
            ? await this.recipes.listByCategoryId(filter.categoryId)
            : await this.recipes.list();
        if (filter?.search) {
            const searchQuery = filter.search.trim().toLowerCase();
            return items.filter((recipe) => recipe.title.toLowerCase().includes(searchQuery) ||
                (recipe.description &&
                    recipe.description.toLowerCase().includes(searchQuery)) ||
                recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(searchQuery)));
        }
        return items;
    }
    async get(id) {
        const found = await this.recipes.findById(id);
        if (!found)
            throw new Error("Recipe not found");
        return found;
    }
    async update(id, data) {
        if (data.categoryId) {
            const category = await this.categories.findById(data.categoryId);
            if (!category)
                throw new Error("Category does not exist");
        }
        if (data.title !== undefined) {
            const title = data.title.trim();
            if (!title)
                throw new Error("Title is required");
            return this.recipes.update(id, { ...data, title });
        }
        return this.recipes.update(id, data);
    }
    async delete(id) {
        await this.recipes.delete(id);
    }
}
exports.RecipeService = RecipeService;
