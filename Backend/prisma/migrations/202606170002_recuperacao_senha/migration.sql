CREATE TABLE `password_reset_tokens` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `usuarioId` INTEGER NOT NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `expiraEm` DATETIME(3) NOT NULL,
  `usadoEm` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `password_reset_tokens_tokenHash_key` ON `password_reset_tokens`(`tokenHash`);
CREATE INDEX `password_reset_tokens_usuarioId_createdAt_idx` ON `password_reset_tokens`(`usuarioId`, `createdAt`);

ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
