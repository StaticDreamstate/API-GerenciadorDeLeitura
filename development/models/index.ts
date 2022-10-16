import { mySqlConnection } from "../database";
import Usuarios from "./Usuarios";

const Usuario = new Usuarios(mySqlConnection);


export { Usuario }