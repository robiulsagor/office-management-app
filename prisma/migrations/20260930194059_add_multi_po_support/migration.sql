/*
  Warnings:

  - You are about to drop the column `purchaseOrderId` on the `Style` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_purchaseOrderId_fkey";

-- DropIndex
DROP INDEX "Style_purchaseOrderId_idx";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "purchaseOrderId" TEXT;

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "purchaseOrderId";

-- CreateTable
CREATE TABLE "StylePurchaseOrder" (
    "styleId" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StylePurchaseOrder_pkey" PRIMARY KEY ("styleId","purchaseOrderId")
);

-- CreateIndex
CREATE INDEX "StylePurchaseOrder_purchaseOrderId_idx" ON "StylePurchaseOrder"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "Style_styleNumber_idx" ON "Style"("styleNumber");

-- AddForeignKey
ALTER TABLE "StylePurchaseOrder" ADD CONSTRAINT "StylePurchaseOrder_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StylePurchaseOrder" ADD CONSTRAINT "StylePurchaseOrder_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
