-- -- AlterTable
-- ALTER TABLE "Expense" ADD COLUMN     "expenseEntryId" TEXT;

-- -- CreateTable
-- CREATE TABLE "ExpenseEntry" (
--     "id" TEXT NOT NULL,
--     "date" TIMESTAMP(3) NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "ExpenseEntry_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateIndex
-- CREATE INDEX "ExpenseEntry_date_idx" ON "ExpenseEntry"("date");

-- -- CreateIndex
-- CREATE INDEX "Expense_expenseEntryId_idx" ON "Expense"("expenseEntryId");

-- -- AddForeignKey
-- ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expenseEntryId_fkey" FOREIGN KEY ("expenseEntryId") REFERENCES "ExpenseEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;




-- AlterTable
ALTER TABLE "Expense"
ADD COLUMN "expenseEntryId" TEXT;

-- CreateTable
CREATE TABLE "ExpenseEntry" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseEntry_pkey" PRIMARY KEY ("id")
);

-- Backfill: Create one daily entry for each existing expense date.
INSERT INTO "ExpenseEntry" (
    "id",
    "date",
    "createdAt",
    "updatedAt"
)
SELECT
    substr(md5(random()::text || clock_timestamp()::text), 1, 25),
    MIN("date"),
    NOW(),
    NOW()
FROM "Expense"
GROUP BY "date"::date;

-- Backfill: Link existing expenses to their daily entry.
UPDATE "Expense" AS e
SET "expenseEntryId" = ee."id"
FROM "ExpenseEntry" AS ee
WHERE e."date"::date = ee."date"::date;

-- CreateIndex
CREATE INDEX "ExpenseEntry_date_idx"
ON "ExpenseEntry"("date");

-- CreateIndex
CREATE INDEX "Expense_expenseEntryId_idx"
ON "Expense"("expenseEntryId");

-- AddForeignKey
ALTER TABLE "Expense"
ADD CONSTRAINT "Expense_expenseEntryId_fkey"
FOREIGN KEY ("expenseEntryId")
REFERENCES "ExpenseEntry"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
