/*
  Warnings:

  - You are about to drop the column `buyer` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `po` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `programme` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `Order` table. All the data in the column will be lost.
  - Added the required column `styleId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_buyer_idx";

-- DropIndex
DROP INDEX "Order_po_key";

-- DropIndex
DROP INDEX "Order_programme_idx";

-- DropIndex
DROP INDEX "Order_style_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "buyer",
DROP COLUMN "po",
DROP COLUMN "programme",
DROP COLUMN "style",
ADD COLUMN     "styleId" TEXT NOT NULL,
ALTER COLUMN "qtyPiece" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Style" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "styleNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Style_purchaseOrderId_idx" ON "Style"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_programmeId_idx" ON "PurchaseOrder"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_programmeId_poNumber_key" ON "PurchaseOrder"("programmeId", "poNumber");

-- CreateIndex
CREATE INDEX "Programme_buyerId_idx" ON "Programme"("buyerId");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_name_key" ON "Buyer"("name");

-- CreateIndex
CREATE INDEX "Buyer_isActive_idx" ON "Buyer"("isActive");

-- CreateIndex
CREATE INDEX "Order_styleId_idx" ON "Order"("styleId");

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
