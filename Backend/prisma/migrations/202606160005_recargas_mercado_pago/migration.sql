CREATE TABLE `recargas` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('PENDENTE', 'APROVADA', 'RECUSADA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
  `preferenceId` VARCHAR(191) NULL,
  `paymentId` VARCHAR(191) NULL,
  `checkoutUrl` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `recargas_usuarioId_createdAt_idx` ON `recargas`(`usuarioId`, `createdAt`);

ALTER TABLE `recargas` ADD CONSTRAINT `recargas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
