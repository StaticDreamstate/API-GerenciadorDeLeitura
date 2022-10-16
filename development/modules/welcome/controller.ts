import { Request, Response } from "express";
import ENV from "../../infra/conf/env";

const controller = {

    welcome(req: Request, res: Response) {
      return res.status(200).json(`API ${ENV.API_NAME} version ${ENV.API_VER} running.`);
    },
}

export default controller; 