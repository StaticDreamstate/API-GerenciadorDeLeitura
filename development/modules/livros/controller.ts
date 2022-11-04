import { Request, Response } from "express";
import { Autor, Editora, Livro, ISBN } from "../../models";
import logger from "../../infra/conf/logger";

const controller = {

  async newBook(req: Request, res: Response) {

    try {

      const { nome, autor, editora, edicao, ano, isbn, paginas, palavrasChave } = req.body;
      const { id } = req.params;
      let nCodigo;

      const livro = await Livro.instance.findOne({ where: { nome: nome, id_usuario: id } });

      if(livro) {

      logger.info(`[newBook]Livro já cadastrado nesta conta -  ${req.socket.remoteAddress}`);
      return res.status(400).json(`Livro já cadastrado nesta conta.`);

      }

      const at = await Autor.instance.findOne({ where: { nome: autor } });
      const ed = await Editora.instance.findOne({ where: { nome: editora } });
      const codigo = await ISBN.instance.findOne({ where: { codigo: isbn } });

      if (!ed) {
        Editora.instance.create({ nome: editora, total_livros: 0 });
        logger.info(`[newBook]Nova editora cadastrada: ${editora} -  ${req.socket.remoteAddress}`);
      }

      if (!at) {
        Autor.instance.create({ nome: autor, total_livros: 0 });
        logger.info(`[newBook]Novo autor cadastrado: ${autor} -  ${req.socket.remoteAddress}`);
      }

      if (!codigo) { nCodigo = await ISBN.instance.create({ codigo: isbn }); }

      else { nCodigo = codigo; }

      const nBook = await Livro.instance.create({
        id_usuario: Number(id),
        nome: nome,
        autor_id: at.id,
        editora_id: ed.id,
        ano: ano,
        edicao: edicao,
        isbn_id: nCodigo.id,
        paginas: paginas,
        paginas_atual: 0,
        restante: 0,
        palavras_chave: palavrasChave
      });

      await Editora.instance.update(
        { total_livros: Number(at.total_livros + 1) },
        { where: { id: ed.id } });

      await Autor.instance.update(
        { total_livros: Number(at.total_livros + 1) },
        { where: { id: at.id } });

      logger.info(`[newBook]Novo livro adicionado: ${nBook.nome} -  ${req.socket.remoteAddress}`);
      return res.status(200).json(`Novo livro adicionado: ${nBook.nome}`);

    } catch (error) {
      logger.error(`[newBook]${error} -  ${req.socket.remoteAddress}`)
      return res.status(500).json(`${error}`);
    }

  },

  async setMarker(req: Request, res: Response) {

    try {

      const { nome, novaPagina } = req.body;
      const { id } = req.params;

      const livro = await Livro.instance.findOne({where:{ id_usuario: Number(id), nome: nome }});

      if (!livro) {
        logger.error(`[setMarker] Livro ${nome} não encontrado.`);
        return res.status(404).json(`Livro ${nome} não encontrado.`);
      }

      if (Number(novaPagina) <= Number(livro.pagina_atual)) {
        logger.error(`[setMarker] Pagina informada ${novaPagina} é menor ou igual a página atual (${livro.pagina_atual})`);
        return res.status(400).json(`Você tentou atualizar a página para uma página menor ou igual do que a atual (${livro.pagina_atual})`);
      }

      const novoTotal = Number(livro.paginas) - Number(novaPagina);
      await Livro.instance.update({ pagina_atual: novaPagina, restante: novoTotal }, 
        {where: {id_usuario: Number(id), nome: nome}});

      logger.info(`[setMarker] Página ${livro.pagina_atual} do livro ${livro.nome} marcada`);
      return res.status(200).json(`Progresso registrado: ${novaPagina}`);
    }

    catch (error) {

      logger.error(`[setMarker]${error}`)
      return res.status(500).json(`${error}`);

    }

  },

  async purgeBook(req: Request, res: Response) {

    try {
      const { nome, autor, editora } = req.body;
      const { id } = req.params;

      let tmp = await Livro.instance.findOne({where: {nome: nome, id_usuario: id}}); 
      console.log(tmp);
      if(tmp) {

        await tmp.destroy({ where: { id_usuario: id, nome: nome } });
        
        tmp = await Editora.instance.findOne({where: {nome: editora}}); 
        await tmp.update({ total_livros: (Number(tmp.total_livros)-1) });
        
        if (tmp.total_livros <= 0) {
          await Editora.instance.destroy({where: {nome: editora}});
        }
      
        tmp = await Autor.instance.findOne({where: {nome: autor}}); 
        await tmp.update({ total_livros: (Number(tmp.total_livros)-1) });
      
        if (tmp.total_livros <= 0) {
          await Autor.instance.destroy({where: {nome: autor}});
        }
     
        logger.info(`[purgeBook]Livro ${nome} deletado. -  ${req.socket.remoteAddress}`);
        return res.sendStatus(204);

      }

      else {
        logger.error(`[purgeBook]Livro ${nome} não encontrado. -  ${req.socket.remoteAddress}`);
        return res.status(404).json(`Livro ${nome} não encontrado em sua conta.`);
      }

    } catch (error) {
      logger.error(`[purgeBook]Erro ao deletar livro do banco: ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
    }

  },

  async userBooks(req: Request, res: Response) {

    try {

      const { id } = req.params;
      const { nome } = req.body;
      let myList;

      if(nome.length > 0) {
        myList = await Livro.instance.findOne({ where: { id_usuario: id, nome: nome } });
      }
      
      else { 
        myList = await Livro.instance.findAll({ where: { id_usuario: id } });
      }

      logger.info(`[userBook]Consulta (livros) do usuário ${myList.id_usuario} realizada. - ${req.socket.remoteAddress}`);
      return res.status(200).json(myList);

    } catch (error) {
      logger.error(`[userBook]Erro de consulta (livros) : ${error}-  ${req.socket.remoteAddress}`);
      return res.status(500).json(`${error}`);
    }

  }
  
}

export default controller;
