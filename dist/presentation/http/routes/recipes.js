"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipesRoutes = recipesRoutes;
const express_1 = require("express");
function recipesRoutes(service) {
    const router = (0, express_1.Router)();
    router.get("/", async (req, res, next) => {
        try {
            const items = await service.list({
                categoryId: req.query.categoryId,
                search: req.query.search,
            });
            res.json(items);
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/:id", async (req, res, next) => {
        try {
            const item = await service.get(req.params.id);
            res.json(item);
        }
        catch (error) {
            next(error);
        }
    });
    router.post("/", async (req, res, next) => {
        try {
            const item = await service.create({
                title: String(req.body.title ?? ""),
                description: req.body.description,
                ingredients: Array.isArray(req.body.ingredients)
                    ? req.body.ingredients.map(String)
                    : [],
                steps: Array.isArray(req.body.steps) ? req.body.steps.map(String) : [],
                categoryId: String(req.body.categoryId ?? ""),
            });
            res.status(201).json(item);
        }
        catch (error) {
            next(error);
        }
    });
    router.put("/:id", async (req, res, next) => {
        try {
            const item = await service.update(req.params.id, {
                title: req.body.title,
                description: req.body.description,
                ingredients: req.body.ingredients,
                steps: req.body.steps,
                categoryId: req.body.categoryId,
            });
            res.json(item);
        }
        catch (error) {
            next(error);
        }
    });
    router.delete("/:id", async (req, res, next) => {
        try {
            await service.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
