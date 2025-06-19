-- AlterTable
ALTER TABLE `categories` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `customers` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `menu_items` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `notifications` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `order_items` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `orders` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `restaurant_documents` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    ADD COLUMN `coverUrl` VARCHAR(191) NULL,
    ADD COLUMN `nameApprovedAt` DATETIME(3) NULL,
    ADD COLUMN `nameChangeRequestedAt` DATETIME(3) NULL,
    ADD COLUMN `nameRejectReason` VARCHAR(191) NULL,
    ADD COLUMN `nameRejectedAt` DATETIME(3) NULL,
    ADD COLUMN `pendingName` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `riders` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `health_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `height` DOUBLE NULL,
    `weight` DOUBLE NULL,
    `age` INTEGER NULL,
    `gender` VARCHAR(191) NULL,
    `activityLevel` VARCHAR(191) NULL,
    `healthGoal` VARCHAR(191) NULL,
    `targetWeight` DOUBLE NULL,
    `dailyCalories` INTEGER NULL,
    `dietaryRestrictions` VARCHAR(191) NULL,
    `allergies` VARCHAR(191) NULL,
    `dislikes` VARCHAR(191) NULL,
    `medicalConditions` VARCHAR(191) NULL,
    `medications` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `health_profiles_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plans` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('KETO', 'CLEAN_EATING', 'LOW_CARB', 'VEGAN', 'VEGETARIAN', 'PALEO', 'MEDITERRANEAN', 'WEIGHT_LOSS', 'MUSCLE_GAIN', 'BALANCED') NOT NULL,
    `duration` ENUM('SEVEN_DAYS', 'FOURTEEN_DAYS', 'THIRTY_DAYS') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `price` DOUBLE NOT NULL,
    `originalPrice` DOUBLE NULL,
    `totalMeals` INTEGER NOT NULL,
    `mealsPerDay` INTEGER NOT NULL,
    `includesSnacks` BOOLEAN NOT NULL DEFAULT false,
    `avgCaloriesPerDay` INTEGER NULL,
    `avgProteinPerDay` DOUBLE NULL,
    `avgCarbsPerDay` DOUBLE NULL,
    `avgFatPerDay` DOUBLE NULL,
    `image` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `isPopular` BOOLEAN NOT NULL DEFAULT false,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_meals` (
    `id` VARCHAR(191) NOT NULL,
    `mealPlanId` VARCHAR(191) NOT NULL,
    `menuItemId` VARCHAR(191) NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `mealType` ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DRINK') NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `portion` DOUBLE NOT NULL DEFAULT 1.0,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `meal_plan_meals_mealPlanId_dayNumber_mealType_order_key`(`mealPlanId`, `dayNumber`, `mealType`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `mealPlanId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `deliveryTime` VARCHAR(191) NULL,
    `specialInstructions` VARCHAR(191) NULL,
    `skipDates` VARCHAR(191) NULL,
    `customMeals` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_deliveries` (
    `id` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NOT NULL,
    `riderId` VARCHAR(191) NULL,
    `deliveryDate` DATETIME(3) NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SCHEDULED',
    `scheduledTime` VARCHAR(191) NULL,
    `preparedAt` DATETIME(3) NULL,
    `pickedUpAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelReason` VARCHAR(191) NULL,
    `deliveryFee` DOUBLE NOT NULL DEFAULT 0,
    `specialInstructions` VARCHAR(191) NULL,
    `deliveryNotes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `meal_plan_deliveries_subscriptionId_dayNumber_key`(`subscriptionId`, `dayNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_delivery_meals` (
    `id` VARCHAR(191) NOT NULL,
    `deliveryId` VARCHAR(191) NOT NULL,
    `menuItemId` VARCHAR(191) NOT NULL,
    `mealType` ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DRINK') NOT NULL,
    `portion` DOUBLE NOT NULL DEFAULT 1.0,
    `isDelivered` BOOLEAN NOT NULL DEFAULT false,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nutrition_info` (
    `id` VARCHAR(191) NOT NULL,
    `menuItemId` VARCHAR(191) NOT NULL,
    `calories` DOUBLE NULL,
    `protein` DOUBLE NULL,
    `carbohydrates` DOUBLE NULL,
    `fat` DOUBLE NULL,
    `fiber` DOUBLE NULL,
    `sugar` DOUBLE NULL,
    `sodium` DOUBLE NULL,
    `vitaminA` DOUBLE NULL,
    `vitaminC` DOUBLE NULL,
    `calcium` DOUBLE NULL,
    `iron` DOUBLE NULL,
    `servingSize` VARCHAR(191) NULL,
    `ingredients` VARCHAR(191) NULL,
    `allergens` VARCHAR(191) NULL,
    `isGlutenFree` BOOLEAN NOT NULL DEFAULT false,
    `isDairyFree` BOOLEAN NOT NULL DEFAULT false,
    `isVegan` BOOLEAN NOT NULL DEFAULT false,
    `isVegetarian` BOOLEAN NOT NULL DEFAULT false,
    `isKeto` BOOLEAN NOT NULL DEFAULT false,
    `isLowCarb` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nutrition_info_menuItemId_key`(`menuItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `health_profiles` ADD CONSTRAINT `health_profiles_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_meals` ADD CONSTRAINT `meal_plan_meals_mealPlanId_fkey` FOREIGN KEY (`mealPlanId`) REFERENCES `meal_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_meals` ADD CONSTRAINT `meal_plan_meals_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `menu_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_subscriptions` ADD CONSTRAINT `meal_plan_subscriptions_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_subscriptions` ADD CONSTRAINT `meal_plan_subscriptions_mealPlanId_fkey` FOREIGN KEY (`mealPlanId`) REFERENCES `meal_plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_deliveries` ADD CONSTRAINT `meal_plan_deliveries_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `meal_plan_subscriptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_deliveries` ADD CONSTRAINT `meal_plan_deliveries_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `customer_addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_deliveries` ADD CONSTRAINT `meal_plan_deliveries_riderId_fkey` FOREIGN KEY (`riderId`) REFERENCES `riders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_delivery_meals` ADD CONSTRAINT `meal_plan_delivery_meals_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `meal_plan_deliveries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_delivery_meals` ADD CONSTRAINT `meal_plan_delivery_meals_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `menu_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutrition_info` ADD CONSTRAINT `nutrition_info_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
