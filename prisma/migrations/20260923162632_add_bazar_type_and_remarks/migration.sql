-- CreateEnum
CREATE TYPE "BazarType" AS ENUM ('REGULAR', 'GUEST');

-- AlterTable
ALTER TABLE "BazarEntry" ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "type" "BazarType" NOT NULL DEFAULT 'REGULAR';

-- CreateIndex
CREATE INDEX "BazarEntry_type_idx" ON "BazarEntry"("type");
