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
const crypto_js_1 = __importDefault(require("crypto-js"));
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
    reset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`[reset] Requisição de reset de senha: ${req.socket.remoteAddress}`);
                const { login } = req.body;
                const savedUser = yield models_1.Usuario.instance.findOne({ where: { login: login } });
                if (!savedUser) {
                    logger_1.default.error(`[reset] Usuário não encontrado: ${req.socket.remoteAddress}`);
                    return res.status(404).json("Login não encontrado.");
                }
                logger_1.default.info(`[reset] Usuário = ${JSON.stringify(savedUser.login)} : ${req.socket.remoteAddress}`);
                const token = crypto_js_1.default.AES.encrypt(`${savedUser.login}`, env_1.default.KEY).toString();
                savedUser.hashReset = token;
                yield savedUser.save();
                logger_1.default.info(`[reset] Hash gerado: ${req.socket.remoteAddress}`);
                return res.status(200).json(token);
            }
            catch (error) {
                logger_1.default.error(`[reset] Erro: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    recover(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`[recover] Recuperação de senha em progresso: ${req.socket.remoteAddress}`);
                const { token, senha } = req.body;
                const bytes = crypto_js_1.default.AES.decrypt(token, env_1.default.KEY);
                const login = bytes.toString(crypto_js_1.default.enc.Utf8);
                if (!login) {
                    logger_1.default.error(`[recover] Token inválido - Login não existe:  ${req.socket.remoteAddress}`);
                    return res.status(400).json("token invalido");
                }
                const savedUser = yield models_1.Usuario.instance.findOne({ where: { login: login } });
                if (!savedUser) {
                    logger_1.default.error(`[recover] Login não encontrado login= ${login} - ${req.socket.remoteAddress}`);
                    return res.status(404).json("Login não encontrado");
                }
                //Erro aqui:
                if (!savedUser.hashReset || savedUser.hashReset !== token) {
                    logger_1.default.error(`[recover] Token diferente/Inexistente no banco de dados - ${req.socket.remoteAddress}`);
                    return res.status(400).json("token invalido");
                }
                if (bcryptjs_1.default.compareSync(senha, savedUser.senha)) {
                    logger_1.default.error(`[recover] Tentativa de mudança com a mesma senha - ${req.socket.remoteAddress}`);
                    return res.status(400).json("Senha ja utilizada");
                }
                const newPass = bcryptjs_1.default.hashSync(senha, 10);
                savedUser.senha = newPass;
                savedUser.hashReset = null;
                yield savedUser.save();
                logger_1.default.info(`[recover] Senha alterada: ${req.socket.remoteAddress}`);
                return res.sendStatus(201);
            }
            catch (error) {
                logger_1.default.error(`[recover] Erro: ${error} - ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    }
};
exports.default = controller;
