-- DropForeignKey
ALTER TABLE `Request` DROP FOREIGN KEY `Request_workbenchId_fkey`;

-- AlterTable
ALTER TABLE `Request` MODIFY `workbenchId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_workbenchId_fkey` FOREIGN KEY (`workbenchId`) REFERENCES `Workbench`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
