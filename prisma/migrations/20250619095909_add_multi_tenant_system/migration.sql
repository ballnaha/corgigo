/*
  Warnings:

  - A unique constraint covering the columns `[subdomain]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customDomain]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `bannerUrl` VARCHAR(191) NULL,
    ADD COLUMN `customDomain` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isSuspended` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `logoUrl` VARCHAR(191) NULL,
    ADD COLUMN `subdomain` VARCHAR(191) NULL,
    ADD COLUMN `suspendReason` VARCHAR(191) NULL,
    ADD COLUMN `suspendedAt` DATETIME(3) NULL,
    ADD COLUMN `suspendedBy` VARCHAR(191) NULL,
    ADD COLUMN `themeAccentColor` VARCHAR(191) NOT NULL DEFAULT '#EF4444',
    ADD COLUMN `themePrimaryColor` VARCHAR(191) NOT NULL DEFAULT '#10B981',
    ADD COLUMN `themeSecondaryColor` VARCHAR(191) NOT NULL DEFAULT '#F59E0B';

-- CreateTable
CREATE TABLE `restaurant_domains` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `domainType` ENUM('SUBDOMAIN', 'CUSTOM') NOT NULL,
    `domainValue` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifiedAt` DATETIME(3) NULL,
    `sslStatus` VARCHAR(191) NULL,
    `sslIssuedAt` DATETIME(3) NULL,
    `sslExpiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `restaurant_domains_domainValue_key`(`domainValue`),
    INDEX `restaurant_domains_domainValue_idx`(`domainValue`),
    INDEX `restaurant_domains_restaurantId_idx`(`restaurantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `restaurants_subdomain_key` ON `restaurants`(`subdomain`);

-- CreateIndex
CREATE UNIQUE INDEX `restaurants_customDomain_key` ON `restaurants`(`customDomain`);

-- AddForeignKey
ALTER TABLE `restaurant_domains` ADD CONSTRAINT `restaurant_domains_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
