import { Router } from "express";
import welcomeRoutes from "../../modules/welcome/routes";
import createRoutes from "../../modules/cadastro/routes";
import loginRoutes from "../../modules/login/routes";
import bookRoutes from "../../modules/livros/routes";

const routes = Router();

routes.use(welcomeRoutes);
routes.use(createRoutes);
routes.use(loginRoutes);
routes.use(bookRoutes);

export default routes;