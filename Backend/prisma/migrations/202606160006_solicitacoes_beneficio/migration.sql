CREATE TABLE `solicitacoes_beneficio` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NOT NULL,
  `tipoSolicitado` ENUM('COMUM', 'ESTUDANTE', 'IDOSO') NOT NULL,
  `status` ENUM('PENDENTE', 'APROVADA', 'RECUSADA') NOT NULL DEFAULT 'PENDENTE',
  `dados` TEXT NOT NULL,
  `observacao` TEXT NOT NULL,
  `respostaAdmin` TEXT NULL,
  `analisadoEm` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `solicitacoes_beneficio_usuarioId_createdAt_idx` ON `solicitacoes_beneficio`(`usuarioId`, `createdAt`);
CREATE INDEX `solicitacoes_beneficio_status_createdAt_idx` ON `solicitacoes_beneficio`(`status`, `createdAt`);

ALTER TABLE `solicitacoes_beneficio` ADD CONSTRAINT `solicitacoes_beneficio_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
