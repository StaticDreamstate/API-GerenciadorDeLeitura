import { DataTypes } from "sequelize";
import Connection from "../database/Connection";

export default class Usuarios {
  
  instance: any;
  modelName: string = "Usuarios";

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
        nome: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        login: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        senha: {
          type: DataTypes.STRING(300),
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
        tableName: "usuarios",
      }
    );
  }
}