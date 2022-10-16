import { Sequelize, Options } from "sequelize";
import logger from "../infra/conf/logger";

export default class Connection {

    private instance: Sequelize;

    private db_name: string;
    private db_user: string;
    private db_pass: string;
    private db_config: Options;

    constructor(
        nome: string,
        usuario: string,
        senha: string,
        conf: Options
    ) {
        this.db_name = nome;
        this.db_user = usuario;
        this.db_pass = senha;
        this.db_config = conf;

        try {
            this.instance = new Sequelize(
                this.db_name,
                this.db_user,
                this.db_pass,
                this.db_config
            );
        } catch (erro) {
            console.error("[!] Conexão Recusada.");
            throw erro;
        }
    }

    getInstance() {
        return this.instance;
    }

    async hasConnection() {
        try {
            await this.instance.authenticate();
            console.log("[OK] Banco de dados conectado.");
            logger.info("[hasConnection] Conexão ao banco de dados realizada.");
        } catch (erro) {
            console.error("[!] Falha na conexão.");
            logger.error("[hasConnection] Tentativa de conexao ao banco de dados recusada.");
            return;
        }
    }
};