import { prisma } from "../lib/prisma";

const bazarItems = [
  { nameEn: "Rice", nameBn: "চাল" },
  { nameEn: "Potato", nameBn: "আলু" },
  { nameEn: "Onion", nameBn: "পেঁয়াজ" },
  { nameEn: "Garlic", nameBn: "রসুন" },
  { nameEn: "Ginger", nameBn: "আদা" },
  { nameEn: "Cooking Oil", nameBn: "তেল" },
  { nameEn: "Salt", nameBn: "লবণ" },
  { nameEn: "Sugar", nameBn: "চিনি" },
  { nameEn: "Fish", nameBn: "মাছ" },
  { nameEn: "Chicken", nameBn: "মুরগি" },
  { nameEn: "Beef", nameBn: "গরুর মাংস" },
  { nameEn: "Mutton", nameBn: "খাসির মাংস" },
  { nameEn: "Vegetables", nameBn: "সবজি" },
  { nameEn: "Lentil", nameBn: "ডাল" },
  { nameEn: "Tea", nameBn: "চা" },
  { nameEn: "Milk", nameBn: "দুধ" },
  { nameEn: "Egg", nameBn: "ডিম" },
];

async function main() {
  for (const item of bazarItems) {
    await prisma.bazarItem.upsert({
      where: {
        nameEn: item.nameEn,
      },
      update: {
        nameBn: item.nameBn,
      },
      create: item,
    });
  }

  console.log("Bazar master items seeded successfully.");
}

main().catch((error) => {
  console.error("Seed error:", error);
  process.exit(1);
});