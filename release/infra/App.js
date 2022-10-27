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
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/");
const logger_1 = __importDefault(require("./conf/logger"));
const baseRoutes_1 = __importDefault(require("../infra/conf/baseRoutes"));
class App {
    constructor() {
        this.defaultPort = 8080;
        this.instance = (0, express_1.default)();
    }
    setup(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance.use(express_1.default.json());
            this.instance.use(express_1.default.urlencoded({ extended: true }));
            this.instance.use(baseRoutes_1.default);
            const appPort = options.port ? options.port : this.defaultPort;
            if (options.test) {
                console.log("[OK] Teste de configuração.");
                return;
            }
            try {
                this.instance.listen(appPort, () => {
                    console.log(`[OK] API aguardando requisições... [Porta TCP ${appPort}]`);
                    logger_1.default.info(`[setup] API aguardando requisições... [Porta TCP ${appPort}]`);
                });
            }
            catch (error) {
                console.log(`[!] Execução da API falhou [Porta TCP ${appPort}]`);
                logger_1.default.error(`[setup] Erro ao tentar rodar a API na porta TCP ${appPort}`);
            }
            database_1.mySqlConnection.hasConnection();
        });
    }
}
exports.default = App;
