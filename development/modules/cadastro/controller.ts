import { Request, Response } from "express";
import logger from "../../infra/conf/logger";
import bcrypt from "bcryptjs";
import { Usuario } from "../../models";

const controller = {

  async cadastrar(req: Request, res: Response) {

    try {
      const { nome, login, senha } = req.body;
      const newHash = bcrypt.hashSync(senha, 10);

      const savedUser = await Usuario.instance.findOne({ where: { login: login } });

      if (savedUser) {
        logger.warn(`[cadastrar] Tentativa repetida de cadastro: ${req.socket.remoteAddress}`);
        return res.status(400).json("Email já cadastrado no banco");
      }

      const newUser = await Usuario.instance.create({
        nome,
        login,
        senha: newHash
      })

      logger.info(`[cadastrar] Cliente cadastrado: ${req.socket.remoteAddress}`);
      return res.status(201).json(newUser);
    } catch (error) {
      logger.error(`[cadastrar] Erro de cadastro do cliente: ${error} - ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
    }
  },

}

export default controller;
