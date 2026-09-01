import { Banknote, Clock3, CircleCheck, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type SalarySummaryProps = {
  totalSalary: number;
  totalPaid: number;
  totalPending: number;
  employeeCount: number;
};

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString("en-BD")}`;
};

const SalarySummary = ({
  totalSalary,
  totalPaid,
  totalPending,
  employeeCount,
}: SalarySummaryProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="border-0 bg-blue-50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-700">
                Total Salary
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-900">
                {formatCurrency(totalSalary)}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Banknote className="size-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-green-50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-700">
                Total Paid
              </p>

              <p className="mt-2 text-2xl font-bold text-green-900">
                {formatCurrency(totalPaid)}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <CircleCheck className="size-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-amber-50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-amber-700">
                Total Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-900">
                {formatCurrency(totalPending)}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock3 className="size-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-purple-50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-700">
                Employees
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-900">
                {employeeCount}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Users className="size-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalarySummary;