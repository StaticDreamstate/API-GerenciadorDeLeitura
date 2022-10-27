"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Usuarios {
    constructor(conexao) {
        this.modelName = "Usuarios";
        const con = conexao.getInstance();
        this.instance = con.define(this.modelName, {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            login: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            senha: {
                type: sequelize_1.DataTypes.STRING(300),
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE(),
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE(),
            },
        }, {
            tableName: "usuarios",
        });
    }
}
exports.default = Usuarios;
