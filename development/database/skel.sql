DROP DATABASE IF EXISTS `MyBK`;
CREATE DATABASE `MyBK`;
USE `MyBK`;

CREATE TABLE `MyBK`.`usuarios` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100) NOT NULL,
	`login` VARCHAR(50) NOT NULL,
	`senha` VARCHAR(100) NOT NULL,
	`createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	`updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

CREATE TABLE `MyBK`.`autores` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100) NOT NULL,
	`nacionalidade` VARCHAR(50),
	`total_livros` INT,
	`createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	`updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

CREATE TABLE `MyBK`.`editoras` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100) NOT NULL,
	`nacionalidade` VARCHAR(200),
	`total_livros` INT,
	`createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	`updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;


CREATE TABLE `MyBK`.`livro` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_usuario` INT NOT NULL,
	`nome` VARCHAR(400) NOT NULL,
	`autor_id` INT NOT NULL,
	`editora_id` INT NOT NULL,
	`ano` VARCHAR(10) NOT NULL,
	`edicao` INT NOT NULL,
	`ISBN` VARCHAR(200),
	`paginas` INT,
	`pagina_atual` INT,
	`total_lido` INT,
	`palavras_chave` VARCHAR(200),
	`createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	`updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY(`id`),
		KEY `FK_usuario` (`id_usuario`),
		KEY `FK_autor` (`autor_id`),
		KEY `FK_editora` (`editora_id`),
		CONSTRAINT `FK_usuario` FOREIGN KEY(`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
		CONSTRAINT `FK_autor` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`) ON DELETE CASCADE, 
		CONSTRAINT `FK_editora` FOREIGN KEY (`editora_id`) REFERENCES `editoras` (`id`) ON DELETE CASCADE 
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/* Dados iniciais para teste */

INSERT INTO `usuarios` (
	`nome`,
	`login`,
	`senha` 
)

VALUES (
	"Dennis Nedry",
	"dnedry",
	"abc123"
);

INSERT INTO `autores` (
	`nome`,
	`nacionalidade`,
	`total_livros` 
)

VALUES (
	"Igor Zhirkov",
	"Russo",
	1
);

INSERT INTO `editoras` (
	`nome`,
	`nacionalidade`,
	`total_livros` 
)

VALUES (
	"Apress",
	"Estados Unidos/Reino Unido/India",
	1
);

INSERT INTO `livro` (
	`id_usuario`,
	`nome`,
	`autor_id`,
	`editora_id`,
	`ano`,
	`edicao`,
	`ISBN`,
	`paginas`,
	`pagina_atual`,
	`total_lido`,
	`palavras_chave` 
)

VALUES (
	1,
	"Programação em Baixo Nível - C, Assembly e execução de programas na arquitetura Intel 64",
	1,
	1,
	"2017",
	1,
	"978-85-7522-667-4",
	576,
	0,
	0,
	"Assembly, C, Intel 64, Programação, Baixo Nivel"
);