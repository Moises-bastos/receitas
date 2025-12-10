"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientMemoryRepository = void 0;
class IngredientMemoryRepository {
    constructor() {
        this.items = [];
    }
    async list() {
        return [...this.items];
    }
    async findById(id) {
        return this.items.find((ingredient) => ingredient.id === id);
    }
    async findByName(name) {
        const normalizedName = name.trim().toLowerCase();
        return this.items.find((ingredient) => ingredient.name.toLowerCase() === normalizedName);
    }
    async create(data) {
        const item = {
            id: data.id,
            name: data.name.trim(),
            createdAt: data.createdAt,
        };
        this.items.push(item);
        return item;
    }
    async update(id, data) {
        const idx = this.items.findIndex((ingredient) => ingredient.id === id);
        if (idx < 0)
            throw new Error("Ingredient not found");
        const current = this.items[idx];
        const updated = {
            ...current,
            name: data.name !== undefined ? data.name.trim() : current.name,
        };
        this.items[idx] = updated;
        return updated;
    }
    async delete(id) {
        this.items = this.items.filter((ingredient) => ingredient.id !== id);
    }
}
exports.IngredientMemoryRepository = IngredientMemoryRepository;
