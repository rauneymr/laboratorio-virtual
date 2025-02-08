-- AlterTable
ALTER TABLE `User` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `disabledAt` DATETIME(3) NULL,
    ADD COLUMN `disabledReason` VARCHAR(191) NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectedReason` VARCHAR(191) NULL;
