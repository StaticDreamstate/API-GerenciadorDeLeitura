"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Livros {
    constructor(conexao) {
        this.modelName = "Livros";
        const con = conexao.getInstance();
        this.instance = con.define(this.modelName, {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            id_usuario: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: "usuarios", key: "id" }
            },
            nome: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            autor_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: "autores", key: "id" }
            },
            editora_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: "editoras", key: "id" }
            },
            ano: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            edicao: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            isbn_id: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                references: { model: "isbn", key: "id" }
            },
            paginas: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            pagina_atual: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            restante: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            rate: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: true,
            },
            palavras_chave: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE(),
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE(),
            },
        }, {
            tableName: "livros",
        });
    }
}
exports.default = Livros;
