-- CreateTable
CREATE TABLE "ConveyanceRecord" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "bill" DECIMAL(65,30) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConveyanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConveyanceRecord_employeeId_idx" ON "ConveyanceRecord"("employeeId");

-- CreateIndex
CREATE INDEX "ConveyanceRecord_date_idx" ON "ConveyanceRecord"("date");

-- CreateIndex
CREATE INDEX "ConveyanceRecord_createdById_idx" ON "ConveyanceRecord"("createdById");

-- AddForeignKey
ALTER TABLE "ConveyanceRecord" ADD CONSTRAINT "ConveyanceRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConveyanceRecord" ADD CONSTRAINT "ConveyanceRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
