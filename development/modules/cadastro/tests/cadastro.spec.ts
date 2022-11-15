import server from "supertest";
import App from "../../../infra/App";
import { faker } from "@faker-js/faker";
import logger from "../../../infra/conf/logger";
import { Usuario } from "../../../models";

const payload = {
    nome: faker.name.firstName(),
    login: faker.internet.userName(),
    senha: faker.internet.password(),
};

const payload_hardcoded = {
    nome: "Dennis Nedry",
    login: "dnedry",
    senha: "nedryland"
};

let usuario = payload;

beforeAll(() => {
    logger.debug("[beforeAll - cadastro] Início da bateria de testes.")
});

afterAll(() => {
    logger.debug("[afterAll - cadastro] Fim da bateria de testes.");
});

describe("Bateria de testes integrados", () => {

    logger.debug("Teste da rota /cadastro");

    test("Cadastro de usuário", async () => {
        const app = new App();
        await app.setup({
            test: true,
        });
        const instance = app.getInstance();
        
        const response = await server(instance).post("/cadastro").send({
            ...usuario,
        });
        expect(response.statusCode).toEqual(201);
        logger.debug(`[/cadastro] Cadastro de cliente: ${usuario.login} - ${response.statusCode}`);

        usuario = payload_hardcoded;
        let cadastrado = await Usuario.instance.findOne({where: {nome: usuario.nome}});

        if(!cadastrado) {
            const response = await server(instance).post("/cadastro").send({
                ...usuario,
            });
            expect(response.statusCode).toEqual(201);
            logger.debug(`[/cadastro] Cadastro de cliente: ${usuario.login} - ${response.statusCode}`);
        }
    });

});