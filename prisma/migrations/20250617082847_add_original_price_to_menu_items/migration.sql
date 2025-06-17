/*
  Warnings:

  - A unique constraint covering the columns `[lineId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `categories` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `customers` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `menu_items` ADD COLUMN `originalPrice` DOUBLE NULL,
    ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `notifications` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `order_items` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `orders` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `restaurant_documents` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `restaurants` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `riders` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `lineId` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_lineId_key` ON `users`(`lineId`);

-- CreateIndex
CREATE UNIQUE INDEX `users_googleId_key` ON `users`(`googleId`);
