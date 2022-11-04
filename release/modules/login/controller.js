"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../infra/conf/logger"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../infra/conf/env"));
const models_1 = require("../../models");
const controller = {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, senha } = req.body;
                const savedUser = yield models_1.Usuario.instance.findOne({ where: { login: login } });
                if (!savedUser) {
                    logger_1.default.warn(`[login] Usuário não cadastrado: ${req.socket.remoteAddress}`);
                    return res.status(404).json("Usuário não-cadastrado.");
                }
                const validPass = bcryptjs_1.default.compareSync(senha, savedUser.senha);
                if (!validPass) {
                    logger_1.default.error(`[login] Erro de login: ${req.socket.remoteAddress}`);
                    return res.status(401).json("Login ou senha inválidos.");
                }
                const token = jsonwebtoken_1.default.sign({
                    id: savedUser.id,
                    login: savedUser.login,
                    nome: savedUser.nome,
                }, env_1.default.KEY);
                return res.status(200).json(token);
            }
            catch (error) {
                logger_1.default.error(`[login] Erro de login do usuário: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
};
exports.default = controller;
