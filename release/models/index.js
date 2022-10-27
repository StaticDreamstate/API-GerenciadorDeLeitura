"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const database_1 = require("../database");
const Usuarios_1 = __importDefault(require("./Usuarios"));
const Usuario = new Usuarios_1.default(database_1.mySqlConnection);
exports.Usuario = Usuario;
