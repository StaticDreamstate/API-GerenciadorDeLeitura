import { DataTypes } from "sequelize";
import Connection from "../database/Connection";

export default class Livros {

    instance: any;
    modelName: string = "Livros";

    constructor(conexao: Connection) {
        const con = conexao.getInstance();

        this.instance = con.define(
            this.modelName,
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                id_usuario: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: { model: "usuarios", key: "id" }
                },

                nome: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },

                autor_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: { model: "autores", key: "id" }
                },

                editora_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: { model: "editoras", key: "id" }
                },

                ano: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },

                edicao: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },

                isbn_id: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    references: { model: "isbn", key: "id" }
                },

                paginas: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },

                pagina_atual: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },

                restante: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                rate: {
                    type: DataTypes.TINYINT,
                    allowNull: true,
                },

                palavras_chave: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },

                createdAt: {
                    type: DataTypes.DATE(),
                },
                updatedAt: {
                    type: DataTypes.DATE(),
                },
            },
            {
                tableName: "livros",
            }
        );
    }
}