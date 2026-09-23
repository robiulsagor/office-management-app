export type BazarUnit = "KG" | "GRAM" | "LITER" | "ML" | "PCS";

export type BazarType = "REGULAR" | "GUEST";

export type BazarMasterItem = {
  id: string;
  nameEn: string;
  nameBn: string;
};

export type BazarItem = {
  id: string;
  bazarItemId: string;
  name: string;
  nameEn: string;
  nameBn: string;
  quantity?: number;
  unit?: BazarUnit;
  price: number;
};

export type BazarEntry = {
  id: string;
  date: string;
  type: BazarType;
  deposit: number;
  remarks?: string;
  createdById: string;
  items: BazarItem[];
};

export type BazarViewMode = "day-wise" | "item-wise";