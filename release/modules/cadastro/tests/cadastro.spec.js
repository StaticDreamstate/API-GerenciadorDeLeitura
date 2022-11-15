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
const supertest_1 = __importDefault(require("supertest"));
const App_1 = __importDefault(require("../../../infra/App"));
const faker_1 = require("@faker-js/faker");
const logger_1 = __importDefault(require("../../../infra/conf/logger"));
const models_1 = require("../../../models");
const payload = {
    nome: faker_1.faker.name.firstName(),
    login: faker_1.faker.internet.userName(),
    senha: faker_1.faker.internet.password(),
};
const payload_hardcoded = {
    nome: "Dennis Nedry",
    login: "dnedry",
    senha: "nedryland"
};
let usuario = payload;
beforeAll(() => {
    logger_1.default.debug("[beforeAll - cadastro] Início da bateria de testes.");
});
afterAll(() => {
    logger_1.default.debug("[afterAll - cadastro] Fim da bateria de testes.");
});
describe("Bateria de testes integrados", () => {
    logger_1.default.debug("Teste da rota /cadastro");
    test("Cadastro de usuário", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).post("/cadastro").send(Object.assign({}, usuario));
        expect(response.statusCode).toEqual(201);
        logger_1.default.debug(`[/cadastro] Cadastro de cliente: ${usuario.login} - ${response.statusCode}`);
        usuario = payload_hardcoded;
        let cadastrado = yield models_1.Usuario.instance.findOne({ where: { nome: usuario.nome } });
        if (!cadastrado) {
            const response = yield (0, supertest_1.default)(instance).post("/cadastro").send(Object.assign({}, usuario));
            expect(response.statusCode).toEqual(201);
            logger_1.default.debug(`[/cadastro] Cadastro de cliente: ${usuario.login} - ${response.statusCode}`);
        }
    }));
});
