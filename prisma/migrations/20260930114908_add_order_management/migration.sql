-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderVersionAction" AS ENUM ('CREATE', 'UPDATE', 'RESTORE', 'DELETE');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "programme" TEXT,
    "po" TEXT,
    "style" TEXT NOT NULL,
    "factory" TEXT,
    "qtySet" INTEGER,
    "qtyPiece" INTEGER NOT NULL,
    "actualPrice" DECIMAL(12,2),
    "factoryPrice" DECIMAL(12,2),
    "totalActualValue" DECIMAL(14,2),
    "totalFactoryValue" DECIMAL(14,2),
    "shipDate" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderVersion" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "action" "OrderVersionAction" NOT NULL,
    "data" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderAuditLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "action" "OrderVersionAction" NOT NULL,
    "changedFields" JSONB,
    "oldValues" JSONB,
    "newValues" JSONB,
    "actedById" TEXT NOT NULL,
    "actedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderSnapshot" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "versionId" TEXT,
    "label" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_buyer_idx" ON "Order"("buyer");

-- CreateIndex
CREATE INDEX "Order_programme_idx" ON "Order"("programme");

-- CreateIndex
CREATE INDEX "Order_style_idx" ON "Order"("style");

-- CreateIndex
CREATE INDEX "Order_factory_idx" ON "Order"("factory");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_shipDate_idx" ON "Order"("shipDate");

-- CreateIndex
CREATE INDEX "Order_createdById_idx" ON "Order"("createdById");

-- CreateIndex
CREATE INDEX "Order_updatedById_idx" ON "Order"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Order_po_key" ON "Order"("po");

-- CreateIndex
CREATE INDEX "OrderVersion_orderId_idx" ON "OrderVersion"("orderId");

-- CreateIndex
CREATE INDEX "OrderVersion_createdById_idx" ON "OrderVersion"("createdById");

-- CreateIndex
CREATE INDEX "OrderVersion_createdAt_idx" ON "OrderVersion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrderVersion_orderId_version_key" ON "OrderVersion"("orderId", "version");

-- CreateIndex
CREATE INDEX "OrderAuditLog_orderId_idx" ON "OrderAuditLog"("orderId");

-- CreateIndex
CREATE INDEX "OrderAuditLog_actedById_idx" ON "OrderAuditLog"("actedById");

-- CreateIndex
CREATE INDEX "OrderAuditLog_actedAt_idx" ON "OrderAuditLog"("actedAt");

-- CreateIndex
CREATE INDEX "OrderSnapshot_orderId_idx" ON "OrderSnapshot"("orderId");

-- CreateIndex
CREATE INDEX "OrderSnapshot_userId_idx" ON "OrderSnapshot"("userId");

-- CreateIndex
CREATE INDEX "OrderSnapshot_versionId_idx" ON "OrderSnapshot"("versionId");

-- CreateIndex
CREATE INDEX "OrderSnapshot_createdAt_idx" ON "OrderSnapshot"("createdAt");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderVersion" ADD CONSTRAINT "OrderVersion_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderVersion" ADD CONSTRAINT "OrderVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAuditLog" ADD CONSTRAINT "OrderAuditLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAuditLog" ADD CONSTRAINT "OrderAuditLog_actedById_fkey" FOREIGN KEY ("actedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnapshot" ADD CONSTRAINT "OrderSnapshot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnapshot" ADD CONSTRAINT "OrderSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnapshot" ADD CONSTRAINT "OrderSnapshot_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "OrderVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
