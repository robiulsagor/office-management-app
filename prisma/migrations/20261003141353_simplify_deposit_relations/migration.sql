/*
  Warnings:

  - You are about to drop the column `depositId` on the `BazarEntry` table. All the data in the column will be lost.
  - You are about to drop the column `depositId` on the `Expense` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BazarEntry" DROP CONSTRAINT "BazarEntry_depositId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_depositId_fkey";

-- DropIndex
DROP INDEX "BazarEntry_depositId_idx";

-- DropIndex
DROP INDEX "Expense_depositId_idx";

-- AlterTable
ALTER TABLE "BazarEntry" DROP COLUMN "depositId";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "depositId";
