import { DataTypes } from "sequelize";
import Connection from "../database/Connection";

export default class Usuarios {

  instance: any;
  modelName: string = "ISBN";

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

        codigo: {
          type: DataTypes.STRING(200),
          allowNull: false,
          unique: true,
        },

        createdAt: {
          type: DataTypes.DATE(),
        },

        updatedAt: {
          type: DataTypes.DATE(),
        },
      },

      {
        tableName: "isbn",
      }
    );
  }
}