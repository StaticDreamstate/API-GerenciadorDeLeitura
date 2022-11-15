"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const logger_1 = __importDefault(require("../../infra/conf/logger"));
const controller = {
    newBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, autor, editora, edicao, ano, isbn, paginas, palavrasChave } = req.body;
                const { id } = req.params;
                let nCodigo;
                const livro = yield models_1.Livro.instance.findOne({ where: { nome: nome, id_usuario: id } });
                if (livro) {
                    logger_1.default.info(`[newBook]Livro já cadastrado nesta conta -  ${req.socket.remoteAddress}`);
                    return res.status(400).json(`Livro já cadastrado nesta conta.`);
                }
                const at = yield models_1.Autor.instance.findOne({ where: { nome: autor } });
                const ed = yield models_1.Editora.instance.findOne({ where: { nome: editora } });
                const codigo = yield models_1.ISBN.instance.findOne({ where: { codigo: isbn } });
                if (!ed) {
                    models_1.Editora.instance.create({ nome: editora, total_livros: 0 });
                    logger_1.default.info(`[newBook]Nova editora cadastrada: ${editora} -  ${req.socket.remoteAddress}`);
                }
                if (!at) {
                    models_1.Autor.instance.create({ nome: autor, total_livros: 0 });
                    logger_1.default.info(`[newBook]Novo autor cadastrado: ${autor} -  ${req.socket.remoteAddress}`);
                }
                if (!codigo) {
                    nCodigo = yield models_1.ISBN.instance.create({ codigo: isbn });
                }
                else {
                    nCodigo = codigo;
                }
                const nBook = yield models_1.Livro.instance.create({
                    id_usuario: Number(id),
                    nome: nome,
                    autor_id: at.id,
                    editora_id: ed.id,
                    ano: ano,
                    edicao: edicao,
                    isbn_id: nCodigo.id,
                    paginas: paginas,
                    pagina_atual: Number(0),
                    restante: paginas,
                    palavras_chave: palavrasChave,
                    rate: Number(0)
                });
                yield models_1.Editora.instance.update({ total_livros: Number(at.total_livros + 1) }, { where: { id: ed.id } });
                yield models_1.Autor.instance.update({ total_livros: Number(at.total_livros + 1) }, { where: { id: at.id } });
                logger_1.default.info(`[newBook]Novo livro adicionado: ${nBook.nome} -  ${req.socket.remoteAddress}`);
                return res.status(200).json(`Novo livro adicionado: ${nBook.nome}`);
            }
            catch (error) {
                logger_1.default.error(`[newBook]${error} -  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    setMarker(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, novaPagina } = req.body;
                const { id } = req.params;
                const livro = yield models_1.Livro.instance.findOne({ where: { id_usuario: Number(id), nome: nome } });
                if (!livro) {
                    logger_1.default.error(`[setMarker] Livro ${nome} não encontrado.`);
                    return res.status(404).json(`Livro ${nome} não encontrado.`);
                }
                if (Number(novaPagina) <= Number(livro.pagina_atual)) {
                    logger_1.default.error(`[setMarker] Pagina informada ${novaPagina} é menor ou igual a página atual (${livro.pagina_atual})`);
                    return res.status(400).json(`Você tentou atualizar a página para uma página menor ou igual do que a atual (${livro.pagina_atual})`);
                }
                const novoTotal = Number(livro.paginas) - Number(novaPagina);
                yield models_1.Livro.instance.update({ pagina_atual: novaPagina, restante: novoTotal }, { where: { id_usuario: Number(id), nome: nome } });
                logger_1.default.info(`[setMarker] Página ${livro.pagina_atual} do livro ${livro.nome} marcada`);
                return res.status(200).json(`Progresso registrado: ${novaPagina}`);
            }
            catch (error) {
                logger_1.default.error(`[setMarker]${error}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    purgeBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, autor, editora } = req.body;
                const { id } = req.params;
                let tmp = yield models_1.Livro.instance.findOne({ where: { nome: nome, id_usuario: id } });
                console.log(tmp);
                if (tmp) {
                    yield tmp.destroy({ where: { id_usuario: id, nome: nome } });
                    tmp = yield models_1.Editora.instance.findOne({ where: { nome: editora } });
                    yield tmp.update({ total_livros: (Number(tmp.total_livros) - 1) });
                    if (tmp.total_livros <= 0) {
                        yield models_1.Editora.instance.destroy({ where: { nome: editora } });
                    }
                    tmp = yield models_1.Autor.instance.findOne({ where: { nome: autor } });
                    yield tmp.update({ total_livros: (Number(tmp.total_livros) - 1) });
                    if (tmp.total_livros <= 0) {
                        yield models_1.Autor.instance.destroy({ where: { nome: autor } });
                    }
                    logger_1.default.info(`[purgeBook]Livro ${nome} deletado. -  ${req.socket.remoteAddress}`);
                    return res.sendStatus(204);
                }
                else {
                    logger_1.default.error(`[purgeBook]Livro ${nome} não encontrado. -  ${req.socket.remoteAddress}`);
                    return res.status(404).json(`Livro ${nome} não encontrado em sua conta.`);
                }
            }
            catch (error) {
                logger_1.default.error(`[purgeBook]Erro ao deletar livro do banco: ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    userBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome } = req.body;
                let myList;
                if (nome.length > 0) {
                    myList = yield models_1.Livro.instance.findOne({ where: { id_usuario: id, nome: nome } });
                }
                else {
                    myList = yield models_1.Livro.instance.findAll({ where: { id_usuario: id } });
                }
                logger_1.default.info(`[userBook]Consulta (livros) do usuário ${myList.id_usuario} realizada. - ${req.socket.remoteAddress}`);
                return res.status(200).json(myList);
            }
            catch (error) {
                logger_1.default.error(`[userBook]Erro de consulta (livros) : ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    },
    rateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, nota } = req.body;
                let bk;
                if (nome.length > 0) {
                    bk = yield models_1.Livro.instance.findOne({ where: { id_usuario: id, nome: nome } });
                    if (Number(bk.pagina_atual) !== Number(bk.paginas)) {
                        return res.status(400).json("Você não pode avaliar um livro que não terminou.");
                    }
                    if (nota < 0 || nota > 10) {
                        return res.status(400).json("A nota do livro deve estar entre 0 e 10.");
                    }
                    bk.update({ rate: Number(nota) });
                    logger_1.default.info(`[rateBook]Livro ${nome} avaliado como nota ${nota}. - ${req.socket.remoteAddress}`);
                    return res.status(200).json(`Livro ${nome} avaliado como nota ${nota}.`);
                }
                else {
                    return res.status(400).json("Nome inválido");
                }
            }
            catch (error) {
                logger_1.default.error(`[userBook]Erro de consulta (livros) : ${error}-  ${req.socket.remoteAddress}`);
                return res.status(500).json(`${error}`);
            }
        });
    }
};
exports.default = controller;
