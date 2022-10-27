import { DataTypes } from "sequelize";
import Connection from "../database/Connection";

export default class Editoras {
  
  instance: any;
  modelName: string = "Editoras";

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
          unique: true,
        },
    
        total_livros: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
        },
        createdAt: {
          type: DataTypes.DATE(),
        },
        updatedAt: {
          type: DataTypes.DATE(),
        },
      },
      {
        tableName: "editoras",
      }
    );
  }
}