import { Router } from "express";
import controller from "./controller";

const routes = Router();

routes.post("/novo-livro/:id", controller.newBook);
routes.put("/atualizar-progresso/:id", controller.setMarker);
routes.delete("/deletar-livro/:id", controller.purgeBook);
routes.get("/consultar-livros", controller.getBooks);
routes.get("/consultar-editoras", controller.getPublishers);
routes.get("/consultar-autores", controller.getAuthors);
routes.get("/seus-livros:/id", controller.userBooks);
routes.get("/suas-editoras:/id", controller.userPublishers);
routes.get("/seus-autores:/id", controller.userAuthors);
export default routes;