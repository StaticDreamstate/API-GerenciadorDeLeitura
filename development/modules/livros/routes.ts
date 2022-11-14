import { Router } from "express";
import controller from "./controller";

const routes = Router();

routes.post("/novo-livro/:id", controller.newBook);
routes.put("/atualizar-progresso/:id", controller.setMarker);
routes.put("/avaliar/:id", controller.rateBook);
routes.delete("/deletar-livro/:id", controller.purgeBook);
routes.get("/seus-livros/:id", controller.userBooks);

export default routes;