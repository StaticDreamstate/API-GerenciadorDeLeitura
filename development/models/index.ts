import { mySqlConnection } from "../database";
import Usuarios from "./Usuarios";
import Editoras from "./Editoras";
import Autores from "./Autores";
import Livros from "./Livros";
import isbn from "./isbn";

const Usuario = new Usuarios(mySqlConnection);
const Editora = new Editoras(mySqlConnection);
const Autor = new Autores(mySqlConnection);
const Livro = new Livros(mySqlConnection);
const ISBN = new isbn(mySqlConnection);

export { Usuario, Editora, Autor, Livro, ISBN }