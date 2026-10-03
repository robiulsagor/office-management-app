-- CreateEnum
CREATE TYPE "DepositPurpose" AS ENUM ('BAZAR', 'OTHER');

-- AlterTable
ALTER TABLE "BazarEntry" ADD COLUMN     "depositId" TEXT;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "depositId" TEXT;

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "purpose" "DepositPurpose",
    "employeeId" TEXT NOT NULL,
    "remarks" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deposit_date_idx" ON "Deposit"("date");

-- CreateIndex
CREATE INDEX "Deposit_employeeId_idx" ON "Deposit"("employeeId");

-- CreateIndex
CREATE INDEX "Deposit_purpose_idx" ON "Deposit"("purpose");

-- CreateIndex
CREATE INDEX "Deposit_createdById_idx" ON "Deposit"("createdById");

-- CreateIndex
CREATE INDEX "BazarEntry_depositId_idx" ON "BazarEntry"("depositId");

-- CreateIndex
CREATE INDEX "Expense_depositId_idx" ON "Expense"("depositId");

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BazarEntry" ADD CONSTRAINT "BazarEntry_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
