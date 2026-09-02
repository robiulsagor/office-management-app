-- CreateEnum
CREATE TYPE "MonthlyConveyanceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISED');

-- CreateEnum
CREATE TYPE "MonthlyConveyanceApprovalAction" AS ENUM ('APPROVED', 'REJECTED', 'REVISED');

-- CreateTable
CREATE TABLE "MonthlyConveyance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "claimedAmount" DECIMAL(65,30) NOT NULL,
    "approvedAmount" DECIMAL(65,30),
    "status" "MonthlyConveyanceStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyConveyance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyConveyanceApproval" (
    "id" TEXT NOT NULL,
    "monthlyConveyanceId" TEXT NOT NULL,
    "action" "MonthlyConveyanceApprovalAction" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "actedById" TEXT NOT NULL,
    "actedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyConveyanceApproval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlyConveyance_month_idx" ON "MonthlyConveyance"("month");

-- CreateIndex
CREATE INDEX "MonthlyConveyance_status_idx" ON "MonthlyConveyance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyConveyance_employeeId_month_key" ON "MonthlyConveyance"("employeeId", "month");

-- CreateIndex
CREATE INDEX "MonthlyConveyanceApproval_monthlyConveyanceId_idx" ON "MonthlyConveyanceApproval"("monthlyConveyanceId");

-- CreateIndex
CREATE INDEX "MonthlyConveyanceApproval_actedById_idx" ON "MonthlyConveyanceApproval"("actedById");

-- CreateIndex
CREATE INDEX "MonthlyConveyanceApproval_actedAt_idx" ON "MonthlyConveyanceApproval"("actedAt");

-- AddForeignKey
ALTER TABLE "MonthlyConveyance" ADD CONSTRAINT "MonthlyConveyance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyConveyanceApproval" ADD CONSTRAINT "MonthlyConveyanceApproval_monthlyConveyanceId_fkey" FOREIGN KEY ("monthlyConveyanceId") REFERENCES "MonthlyConveyance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyConveyanceApproval" ADD CONSTRAINT "MonthlyConveyanceApproval_actedById_fkey" FOREIGN KEY ("actedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
