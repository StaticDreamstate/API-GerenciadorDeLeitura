import { Router } from "express";
import welcomeRoutes from "../../modules/welcome/routes";
import signupRoutes from "../../modules/cadastro/routes";

const routes = Router();

routes.use(welcomeRoutes);
routes.use(signupRoutes);

export default routes;