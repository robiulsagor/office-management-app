/*
  Warnings:

  - Added the required column `programmeId` to the `Style` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Style" ADD COLUMN     "programmeId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Style_programmeId_idx" ON "Style"("programmeId");

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
