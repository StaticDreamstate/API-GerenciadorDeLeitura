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
const logger_1 = __importDefault(require("../../../infra/conf/logger"));
const payload = {
    login: "dnedry",
    senha: "nedryland"
};
let usuario = payload;
beforeAll(() => {
    logger_1.default.debug("[beforeAll - login] Início da bateria de testes.");
});
afterAll(() => {
    logger_1.default.debug("[afterAll - login] Fim da bateria de testes.");
});
describe("Bateria de testes integrados", () => {
    logger_1.default.debug("Teste da rota /cadastro");
    test("Cadastro de usuário", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = new App_1.default();
        yield app.setup({
            test: true,
        });
        const instance = app.getInstance();
        const response = yield (0, supertest_1.default)(instance).post("/login").send(Object.assign({}, usuario));
        expect(response.statusCode).toEqual(200);
        logger_1.default.debug(`[/login] Login de usuário: ${usuario.login} - ${response.statusCode}`);
    }));
});
