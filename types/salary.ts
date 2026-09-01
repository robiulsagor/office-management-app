export type SalaryStatus = "pending" | "paid";

export type PaymentMethod = "cash" | "bank" | "mobile_banking";

export type SalaryRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;

  month: string; // YYYY-MM

  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;

  status: SalaryStatus;

  paymentDate: string | null;
  paymentMethod: PaymentMethod | null;

  remarks: string;
};
