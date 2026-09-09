/*
  Warnings:

  - Made the column `salary` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "salary" SET NOT NULL;
