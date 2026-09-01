export type BazarItem = {
  id: string;
  name: string;
  price: number;
};

export type BazarEntry = {
  id: string;
  date: string;
  deposit: number;
  items: BazarItem[];
};

export type BazarViewMode = "day-wise" | "item-wise";