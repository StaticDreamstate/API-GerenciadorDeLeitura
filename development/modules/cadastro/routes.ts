import { Router } from "express";
import controller from "./controller";

const routes = Router();

routes.post("/cadastro", controller.cadastrar);

export default routes;