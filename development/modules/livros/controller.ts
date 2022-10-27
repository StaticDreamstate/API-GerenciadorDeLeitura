import { Request, Response } from "express";
import { Autor, Editora, Livro, ISBN } from "../../models";
import logger from "../../infra/conf/logger";

const controller = {

  async newBook(req: Request, res: Response) {

    try {

      const { nome, autor, editora, edicao, ano, isbn, paginas, palavrasChave } = req.body;
      const { id_usuario } = req.params;
      let nCodigo;

      const at = await Autor.instance.findOne({ where: { nome: autor } });
      const ed = await Editora.instance.findOne({ where: { nome: editora } });
      const codigo = await ISBN.instance.findOne({ where: { isbn: isbn } });

      if (!ed) {
        Editora.instance.create({ nome: editora, total_livros: 0 });
        logger.info(`[newBook]Nova editora cadastrada: ${editora}`);
      }

      if (!at) {
        Autor.instance.create({ nome: autor, total_livros: 0 });
        logger.info(`[newBook]Novo autor cadastrado: ${autor}`);
      }

      if (!codigo) { nCodigo = await ISBN.instance.create({ isbn: isbn }); }

      else { nCodigo = codigo; }

        const nBook = await Livro.instance.create({
          
          id_usuario: id_usuario,
          nome: nome,
          autor: at.id,
          editora: ed.id,
          ano: ano,
          edicao: edicao,
          isbn: nCodigo.id,
          paginas: paginas,
          paginas_atual: 0,
          total_lido: 0,
          palavras_chave: palavrasChave
        });

        logger.info(`[newBook]Novo livro adicionado: ${nBook.nome}`);
        return res.status(200).json(`Novo livro adicionado: ${nBook.nome}`);

      } catch (error) {
        logger.error(`[newBook]${error}`)
      return res.status(500).json(`${error}`);
    }

  },

  async setMarker(req: Request, res: Response) {

    try {

      const { nome, novaPagina } = req.body;
      const { id_usuario } = req.params;

      const livro = await Livro.instance.findOne({id_usuario: id_usuario, nome: nome});
      
      if(!livro) {
        logger.error(`[setMarker] Livro ${nome} não encontrado.`);
        return res.status(404).json(`Livro ${nome} não encontrado.`);
      }

      if(novaPagina <= livro.pagina_atual) {
        logger.error(`[setMarker] Pagina informada ${novaPagina} é menor ou igual a página atual (${livro.pagina_atual})`);
        return res.status(400).json(`Você tentou atualizar a página para uma página menor do que a atual (${livro.pagina_atual})`);
      }

      const novoTotal = livro.total_lido - novaPagina;
      const bookUpdate = await Livro.instance.findOneAndUpdate({
        id_usuario: id_usuario, pagina_atual: novaPagina, novoTotal: novoTotal },
        { new: true },
      );

      logger.info(`[setMarker] Página ${livro.pagina_atual} do livro ${livro.nome} marcada`);
      return res.status(200).json(`Progresso registrado: ${bookUpdate}`);
    }

   catch(error) {

      logger.error(`[setMarker]${error}`)
      return res.status(500).json(`${error}`);

    }

  },

  async purgeBook(req: Request, res: Response) {

    try {
      const { nome } = req.body;
      const { id } = req.params;
      await Livro.instance.deleteOne({where: { id_usuario: id, nome: nome }});
      
      logger.info(`[purgeBook]Livro ${nome} deletado. -  ${req.socket.remoteAddress}`);
      return res.sendStatus(204);
  
}   catch (error) {
      logger.error(`[purgeBook]Erro ao deletar livro do banco: ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
  }

  },

  async getBooks(req: Request, res: Response) {

    try {

      const { nome } = req.body;
      
      const books = (nome.len > 0) ? await Livro.instance.find({where: {nome: nome}}) : await Livro.instance.find();
      
      logger.info(`[getBook]Consulta de lista (livros) realizada. -  ${req.socket.remoteAddress}`);
      return res.status(200).json(books);
  
}   catch (error) {
      logger.error(`[getBook]Erro fazer consulta de lista (livros): ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
  }

  },

  async getPublishers(req: Request, res: Response) {

    try {

      const { nome } = req.body;
      
      const publishers = (nome.len > 0) ? await Editora.instance.find({where: {nome: nome}}) : await Editora.instance.find();
      
      logger.info(`[getPublishers]Consulta de lista(editoras) realizada. -  ${req.socket.remoteAddress}`);
      return res.status(200).json(publishers);
  
}   catch (error) {
      logger.error(`[getPublishers]Erro fazer consulta de lista(editoras) : ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
  }

  },

  async getAuthors(req: Request, res: Response) {

    try {

      const { nome } = req.body;
      
      const authors = (nome.len > 0) ? await Autor.instance.find({where: {nome: nome}}) : await Autor.instance.find();
      
      logger.info(`[getAuthors]Consulta de lista(autores) realizada. -  ${req.socket.remoteAddress}`);
      return res.status(200).json(authors);
  
}   catch (error) {
      logger.error(`[getAuthors]Erro fazer consulta de lista(autores) : ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
  }

  },

  async userBooks(req: Request, res: Response) {

    try {

      const { id } = req.params;
      const myList = await Livro.instance.find({where: { id_usuario: id }});
      
      logger.info(`[userBook]Consulta (livros) do usuário ${myList.id_usuario} realizada. -  ${req.socket.remoteAddress}`);
      return res.status(200).json(myList);
  
}   catch (error) {
      logger.error(`[userBook]Erro de consulta (livros) : ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
  }

  },

  async userPublishers(req: Request, res: Response) {

    try {

      const { id } = req.params;
      const myList = await Editora.instance.find({where: { id_usuario: id }});
      
      logger.info(`[userPublishers]Consulta (editoras) do usuário ${myList.id_usuario} realizada. -  ${req.socket.remoteAddress}`);
      return res.status(200).json(myList);
  
}   catch (error) {
      logger.error(`[userPublishers]Erro de consulta (editoras) : ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
  }

  },

  async userAuthors(req: Request, res: Response) {

    try {

      const { id } = req.params;
      const myList = await Autor.instance.find({where: { id_usuario: id }});
      
      logger.info(`[userAuthors]Consulta (autores) do usuário ${myList.id_usuario} realizada. -  ${req.socket.remoteAddress}`);
      return res.status(200).json(myList);
  
}   catch (error) {
      logger.error(`[userAuthors]Erro de consulta (autores) : ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
  }

  },


}

export default controller;
