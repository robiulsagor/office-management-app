/*
  Warnings:

  - Made the column `color` on table `Style` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_purchaseOrderId_fkey";

-- AlterTable
ALTER TABLE "Style" ALTER COLUMN "purchaseOrderId" DROP NOT NULL,
ALTER COLUMN "color" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
