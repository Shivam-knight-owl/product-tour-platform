/*
  Warnings:

  - You are about to drop the column `published` on the `Tour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "published",
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
