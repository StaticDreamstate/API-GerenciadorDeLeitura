import Express, { Application } from "express";
import { mySqlConnection } from '../database/';
import logger from "./conf/logger";
import BaseRoutes from "../infra/conf/baseRoutes";

type SetupOptions = {
    test?: boolean;
    port?: number;
}

export default class App {
    private instance: Application;
    private defaultPort: any = 8080;

    constructor() {
        this.instance = Express();
    }

    async setup(options: SetupOptions): Promise<void> {
        this.instance.use(Express.json());
        this.instance.use(Express.urlencoded({ extended: true }));
        this.instance.use(BaseRoutes);

        const appPort = options.port ? options.port : this.defaultPort;

        if (options.test) {
            console.log("[OK] Teste de configuração.");
            return;
        }

        try {
            this.instance.listen(appPort, () => {
                console.log(`[OK] API aguardando requisições... [Porta TCP ${appPort}]`);
                logger.info(`[setup] API aguardando requisições... [Porta TCP ${appPort}]`);
            });
        } catch (error) {
            console.log(`[!] Execução da API falhou [Porta TCP ${appPort}]`);
            logger.error(`[setup] Erro ao tentar rodar a API na porta TCP ${appPort}`);

        }

        mySqlConnection.hasConnection();
    }

    getInstance() {
        return this.instance;
    }
}