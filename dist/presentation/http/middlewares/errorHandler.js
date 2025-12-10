"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    res.status(400).json({ error: message });
}
