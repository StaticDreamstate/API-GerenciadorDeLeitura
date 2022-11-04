"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const routes = (0, express_1.Router)();
routes.post("/novo-livro/:id", controller_1.default.newBook);
routes.put("/atualizar-progresso/:id", controller_1.default.setMarker);
routes.delete("/deletar-livro/:id", controller_1.default.purgeBook);
routes.get("/seus-livros/:id", controller_1.default.userBooks);
exports.default = routes;
