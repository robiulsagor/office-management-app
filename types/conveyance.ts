export type ConveyanceEmployee = {
  id: string;
  name: string;
  designation: string;
};

export type ConveyanceEntry = {
  id: string;
  employeeId: string;
  date: string;
  from: string;
  to: string;
  bill: number;
};
