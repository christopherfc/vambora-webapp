ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN', 'MOTORISTA') NOT NULL DEFAULT 'USER';

CREATE TABLE `motorista_linhas` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NOT NULL,
  `linhaId` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `motorista_linhas_usuarioId_linhaId_key` ON `motorista_linhas`(`usuarioId`, `linhaId`);

CREATE TABLE `veiculo_localizacoes` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NOT NULL,
  `linhaId` INTEGER NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `precisao` DECIMAL(10, 2) NULL,
  `ativo` BOOLEAN NOT NULL DEFAULT true,
  `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `veiculo_localizacoes_usuarioId_key` ON `veiculo_localizacoes`(`usuarioId`);
CREATE INDEX `veiculo_localizacoes_linhaId_ativo_idx` ON `veiculo_localizacoes`(`linhaId`, `ativo`);

ALTER TABLE `motorista_linhas` ADD CONSTRAINT `motorista_linhas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `motorista_linhas` ADD CONSTRAINT `motorista_linhas_linhaId_fkey` FOREIGN KEY (`linhaId`) REFERENCES `linhas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `veiculo_localizacoes` ADD CONSTRAINT `veiculo_localizacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `veiculo_localizacoes` ADD CONSTRAINT `veiculo_localizacoes_linhaId_fkey` FOREIGN KEY (`linhaId`) REFERENCES `linhas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
