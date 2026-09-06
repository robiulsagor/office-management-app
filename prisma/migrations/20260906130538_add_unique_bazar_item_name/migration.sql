/*
  Warnings:

  - A unique constraint covering the columns `[nameEn]` on the table `BazarItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BazarItem_nameEn_key" ON "BazarItem"("nameEn");
