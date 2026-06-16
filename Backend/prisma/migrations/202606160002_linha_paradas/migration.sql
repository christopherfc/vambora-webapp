CREATE TABLE `linha_paradas` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `linhaId` INTEGER NOT NULL,
  `ordem` INTEGER NOT NULL,
  `nome` VARCHAR(191) NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `linha_paradas_linhaId_ordem_key` ON `linha_paradas`(`linhaId`, `ordem`);

ALTER TABLE `linha_paradas` ADD CONSTRAINT `linha_paradas_linhaId_fkey` FOREIGN KEY (`linhaId`) REFERENCES `linhas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
