import "dotenv/config";
import { prisma } from "../lib/prisma";

const expenseCategories = [
  "Fuel",
  "Vehicle Maintenance",
  "Courier",
  "Office Supplies",
  "Utilities",
  "Repair & Maintenance",
  "Hospitality",
  "Other",
];

async function main() {
  for (const name of expenseCategories) {
    await prisma.expenseCategory.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
  }

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });