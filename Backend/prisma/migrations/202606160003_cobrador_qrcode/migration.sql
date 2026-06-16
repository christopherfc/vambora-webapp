ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN', 'MOTORISTA', 'COBRADOR') NOT NULL DEFAULT 'USER';

CREATE UNIQUE INDEX `users_cartaoNumero_key` ON `users`(`cartaoNumero`);

CREATE TABLE `cobrador_linhas` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NOT NULL,
  `linhaId` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `cobrador_linhas_usuarioId_linhaId_key` ON `cobrador_linhas`(`usuarioId`, `linhaId`);

CREATE TABLE `cobrancas` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `cobradorId` INTEGER NOT NULL,
  `passageiroId` INTEGER NOT NULL,
  `linhaId` INTEGER NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('APROVADA', 'RECUSADA') NOT NULL DEFAULT 'APROVADA',
  `codigoCartao` VARCHAR(191) NOT NULL,
  `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `cobrancas_cobradorId_data_idx` ON `cobrancas`(`cobradorId`, `data`);
CREATE INDEX `cobrancas_passageiroId_data_idx` ON `cobrancas`(`passageiroId`, `data`);

ALTER TABLE `cobrador_linhas` ADD CONSTRAINT `cobrador_linhas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cobrador_linhas` ADD CONSTRAINT `cobrador_linhas_linhaId_fkey` FOREIGN KEY (`linhaId`) REFERENCES `linhas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cobrancas` ADD CONSTRAINT `cobrancas_cobradorId_fkey` FOREIGN KEY (`cobradorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cobrancas` ADD CONSTRAINT `cobrancas_passageiroId_fkey` FOREIGN KEY (`passageiroId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cobrancas` ADD CONSTRAINT `cobrancas_linhaId_fkey` FOREIGN KEY (`linhaId`) REFERENCES `linhas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
