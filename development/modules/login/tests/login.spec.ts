import server from "supertest";
import App from "../../../infra/App";
import logger from "../../../infra/conf/logger";

const payload = {
    login: "dnedry",
    senha: "nedryland"
};

let usuario = payload;

beforeAll(() => {
    logger.debug("[beforeAll - login] Início da bateria de testes.")
});

afterAll(() => {
    logger.debug("[afterAll - login] Fim da bateria de testes.");
});

describe("Bateria de testes integrados", () => {

    logger.debug("Teste da rota /cadastro");

    test("Cadastro de usuário", async () => {
        const app = new App();
        await app.setup({
            test: true,
        });
        const instance = app.getInstance();
        
        const response = await server(instance).post("/login").send({
            ...usuario,
        });
        expect(response.statusCode).toEqual(200);
        logger.debug(`[/login] Login de usuário: ${usuario.login} - ${response.statusCode}`);
    });

});