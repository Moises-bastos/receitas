"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.createIngredient = createIngredient;
exports.createRecipe = createRecipe;
const crypto_1 = require("crypto");
function createCategory(input) {
    const name = input.name.trim();
    return {
        id: (0, crypto_1.randomUUID)(),
        name,
        createdAt: new Date(),
    };
}
function createIngredient(input) {
    const name = input.name.trim();
    return {
        id: (0, crypto_1.randomUUID)(),
        name,
        createdAt: new Date(),
    };
}
function createRecipe(input) {
    const title = input.title.trim();
    return {
        id: (0, crypto_1.randomUUID)(),
        title,
        description: input.description,
        ingredients: [...input.ingredients],
        steps: [...input.steps],
        categoryId: input.categoryId,
        createdAt: new Date(),
    };
}
