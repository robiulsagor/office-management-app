export type BazarUnit = "KG" | "GRAM" | "LITER" | "ML" | "PCS";

export type BazarItem = {
  id: string;
  name: string;
  quantity?: number;
  unit?: BazarUnit;
  price: number;
};

export type BazarEntry = {
  id: string;
  date: string;
  deposit: number;
  items: BazarItem[];
};

export type BazarViewMode = "day-wise" | "item-wise";
