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
const models_1 = require("../../models");
const controller = {
    cadastrar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, login, senha } = req.body;
                const newHash = bcryptjs_1.default.hashSync(senha, 10);
                const savedUser = yield models_1.Usuario.instance.findOne({ where: { login: login } });
                if (savedUser) {
                    logger_1.default.warn(`[cadastrar] Tentativa repetida de cadastro: ${req.socket.remoteAddress}`);
                    return res.status(400).json("Usuário já cadastrado no banco");
                }
                const newUser = yield models_1.Usuario.instance.create({
                    nome,
                    login,
                    senha: newHash
                });
                logger_1.default.info(`[cadastrar] Cliente cadastrado: ${req.socket.remoteAddress}`);
                return res.status(201).json(newUser);
            }
            catch (error) {
                logger_1.default.error(`[cadastrar] Erro de cadastro do cliente: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
};
exports.default = controller;
