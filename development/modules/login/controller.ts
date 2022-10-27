import { Request, Response } from "express";
import logger from "../../infra/conf/logger";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../infra/conf/env";

import { Usuario } from "../../models";

const controller = {

  async login(req: Request, res: Response) {

    try {
      const { login, senha } = req.body;

      const savedUser = await Usuario.instance.findOne({ where: { login: login } });

      if (!savedUser) {
        logger.warn(`[login] Usuário não cadastrado: ${req.socket.remoteAddress}`);
        return res.status(404).json("Usuário não-cadastrado.");
      }

      const validPass = bcrypt.compareSync(senha, savedUser.senha);
      if (!validPass) {
        logger.error(`[login] Erro de login: ${req.socket.remoteAddress}`);
        return res.status(401).json("Login ou senha inválidos.");
      }

      const token = jwt.sign(
        {
          id: savedUser.id,
          login: savedUser.login,
          nome: savedUser.nome,
        },

        env.KEY,
      );

      return res.status(200).json(token);

    } catch (error) {
      logger.error(`[login] Erro de login do usuário: ${error} - ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
    }
  },
}

export default controller;
