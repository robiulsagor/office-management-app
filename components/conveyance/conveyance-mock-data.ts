import {
  ConveyanceEmployee,
  ConveyanceEntry,
} from "@/types/conveyance";

export const conveyanceEmployees: ConveyanceEmployee[] = [
  {
    id: "emp-001",
    name: "Sagar",
    designation: "Junior Merchandiser",
  },
  {
    id: "emp-002",
    name: "Rahim Ahmed",
    designation: "Merchandiser",
  },
  {
    id: "emp-003",
    name: "Karim Hasan",
    designation: "Executive",
  },
  {
    id: "emp-004",
    name: "Hasan Mahmud",
    designation: "Accounts Officer",
  },
  {
    id: "emp-005",
    name: "Nayeem Islam",
    designation: "Office Assistant",
  },
];

export const initialConveyanceData: ConveyanceEntry[] = [
  {
    id: "conv-001",
    employeeId: "emp-001",
    date: "2026-09-01",
    from: "Uttara Office",
    to: "Motijheel",
    bill: 250,
  },
  {
    id: "conv-002",
    employeeId: "emp-001",
    date: "2026-09-03",
    from: "Uttara Office",
    to: "Gazipur",
    bill: 400,
  },
  {
    id: "conv-003",
    employeeId: "emp-001",
    date: "2026-09-05",
    from: "Uttara",
    to: "Narayanganj",
    bill: 350,
  },
  {
    id: "conv-004",
    employeeId: "emp-002",
    date: "2026-09-02",
    from: "Office",
    to: "Tejgaon",
    bill: 180,
  },
  {
    id: "conv-005",
    employeeId: "emp-002",
    date: "2026-09-06",
    from: "Office",
    to: "Mirpur",
    bill: 220,
  },
  {
    id: "conv-006",
    employeeId: "emp-003",
    date: "2026-09-04",
    from: "Office",
    to: "Banani",
    bill: 150,
  },
];
