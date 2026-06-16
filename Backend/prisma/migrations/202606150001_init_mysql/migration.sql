CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `senha` VARCHAR(191) NOT NULL,
  `telefone` VARCHAR(191) NOT NULL DEFAULT '',
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `cep` VARCHAR(191) NOT NULL DEFAULT '',
  `rua` VARCHAR(191) NOT NULL DEFAULT '',
  `numeroEndereco` VARCHAR(191) NOT NULL DEFAULT '',
  `complemento` VARCHAR(191) NOT NULL DEFAULT '',
  `bairro` VARCHAR(191) NOT NULL DEFAULT '',
  `cidade` VARCHAR(191) NOT NULL DEFAULT 'Penedo',
  `estado` VARCHAR(191) NOT NULL DEFAULT 'AL',
  `notificacoesHorarios` BOOLEAN NOT NULL DEFAULT true,
  `alertasTarifa` BOOLEAN NOT NULL DEFAULT false,
  `newsletter` BOOLEAN NOT NULL DEFAULT false,
  `cartaoNumero` VARCHAR(191) NOT NULL DEFAULT '4281',
  `cartaoTipo` ENUM('COMUM', 'ESTUDANTE', 'IDOSO') NOT NULL DEFAULT 'COMUM',
  `saldo` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

CREATE TABLE `linhas` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `numero` INTEGER NOT NULL,
  `nome` VARCHAR(191) NOT NULL,
  `tipoTransporte` ENUM('onibus', 'van', 'barco') NOT NULL,
  `tarifa` DECIMAL(10, 2) NOT NULL,
  `infoPagamento` VARCHAR(191) NOT NULL,
  `origem` VARCHAR(191) NOT NULL,
  `destino` VARCHAR(191) NOT NULL,
  `ativo` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `rota_pontos` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `linhaId` INTEGER NOT NULL,
  `ordem` INTEGER NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `rota_pontos_linhaId_ordem_key` ON `rota_pontos`(`linhaId`, `ordem`);

CREATE TABLE `horarios` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `linhaId` INTEGER NOT NULL,
  `tipoDia` ENUM('util', 'sabado', 'domingo_feriado') NOT NULL,
  `horario` VARCHAR(191) NOT NULL,
  `ordem` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `horarios_linhaId_tipoDia_idx` ON `horarios`(`linhaId`, `tipoDia`);

CREATE TABLE `faqs` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `pergunta` VARCHAR(191) NOT NULL,
  `resposta` TEXT NOT NULL,
  `ordem` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `notificacoes` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NULL,
  `tipo` ENUM('alerta', 'info', 'sucesso') NOT NULL,
  `titulo` VARCHAR(191) NOT NULL,
  `descricao` TEXT NOT NULL,
  `lida` BOOLEAN NOT NULL DEFAULT false,
  `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `transacoes` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NOT NULL,
  `descricao` VARCHAR(191) NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `tipo` ENUM('onibus', 'van', 'barco', 'recarga') NOT NULL,
  `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `rota_pontos` ADD CONSTRAINT `rota_pontos_linhaId_fkey` FOREIGN KEY (`linhaId`) REFERENCES `linhas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `horarios` ADD CONSTRAINT `horarios_linhaId_fkey` FOREIGN KEY (`linhaId`) REFERENCES `linhas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `transacoes` ADD CONSTRAINT `transacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
