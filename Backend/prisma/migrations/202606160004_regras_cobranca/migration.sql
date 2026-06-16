ALTER TABLE `cobrancas`
  ADD COLUMN `descontoPercentual` DECIMAL(5, 2) NOT NULL DEFAULT 0,
  ADD COLUMN `valorOriginal` DECIMAL(10, 2) NOT NULL DEFAULT 0;

CREATE TABLE `regras_cobranca` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `tipoCartao` ENUM('COMUM', 'ESTUDANTE', 'IDOSO') NOT NULL,
  `descontoPercentual` DECIMAL(5, 2) NOT NULL DEFAULT 0,
  `ativo` BOOLEAN NOT NULL DEFAULT true,
  `updatedAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `regras_cobranca_tipoCartao_key` ON `regras_cobranca`(`tipoCartao`);

INSERT INTO `regras_cobranca` (`tipoCartao`, `descontoPercentual`, `ativo`, `updatedAt`, `createdAt`) VALUES
  ('COMUM', 0, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('ESTUDANTE', 50, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('IDOSO', 100, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
