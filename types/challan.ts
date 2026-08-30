export type QuantityType =
  | "pcs"
  | "yards"
  | "kgs"
  | "meters"
  | "dozens";

export type ChallanItem = {
  id: string;
  description: string;
  packageCount: number;
  packageType: "roll" | "ctn";
  quantity: number;
  quantityType: QuantityType;
  remarks: string;
};

export type ChallanData = {
  challanNumber: string;
  date: string;
  factoryName: string;
  factoryAddress: string;
  items: ChallanItem[];
};