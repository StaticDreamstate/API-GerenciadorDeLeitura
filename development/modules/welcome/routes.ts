import { Router } from "express";
import controller from "./controller";

const routes = Router();

routes.get("/", controller.welcome);

export default routes;