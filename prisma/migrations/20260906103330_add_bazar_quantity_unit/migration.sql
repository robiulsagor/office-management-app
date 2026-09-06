-- CreateEnum
CREATE TYPE "BazarUnit" AS ENUM ('KG', 'GRAM', 'LITER', 'ML', 'PCS');

-- AlterTable
ALTER TABLE "BazarEntryItem" ADD COLUMN     "quantity" DECIMAL(65,30),
ADD COLUMN     "unit" "BazarUnit";
