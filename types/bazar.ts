export type BazarUnit = "KG" | "GRAM" | "LITER" | "ML" | "PCS";

export type BazarMasterItem = {
  id: string;
  nameEn: string;
  nameBn: string;
};  

export type BazarItem = {
  id: string;
  bazarItemId: string;
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
