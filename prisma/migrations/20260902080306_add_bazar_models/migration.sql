-- CreateTable
CREATE TABLE "BazarItem" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BazarItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BazarEntry" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "deposit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BazarEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BazarEntryItem" (
    "id" TEXT NOT NULL,
    "bazarEntryId" TEXT NOT NULL,
    "bazarItemId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BazarEntryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BazarItem_isActive_idx" ON "BazarItem"("isActive");

-- CreateIndex
CREATE INDEX "BazarEntry_date_idx" ON "BazarEntry"("date");

-- CreateIndex
CREATE INDEX "BazarEntry_createdById_idx" ON "BazarEntry"("createdById");

-- CreateIndex
CREATE INDEX "BazarEntryItem_bazarEntryId_idx" ON "BazarEntryItem"("bazarEntryId");

-- CreateIndex
CREATE INDEX "BazarEntryItem_bazarItemId_idx" ON "BazarEntryItem"("bazarItemId");

-- AddForeignKey
ALTER TABLE "BazarEntry" ADD CONSTRAINT "BazarEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BazarEntryItem" ADD CONSTRAINT "BazarEntryItem_bazarEntryId_fkey" FOREIGN KEY ("bazarEntryId") REFERENCES "BazarEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BazarEntryItem" ADD CONSTRAINT "BazarEntryItem_bazarItemId_fkey" FOREIGN KEY ("bazarItemId") REFERENCES "BazarItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
