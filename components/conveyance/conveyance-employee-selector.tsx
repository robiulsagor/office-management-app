"use client";

import { ConveyanceEmployee } from "@/types/conveyance";

type ConveyanceEmployeeSelectorProps = {
  employees: ConveyanceEmployee[];
  selectedEmployeeId: string;
  onEmployeeChange: (employeeId: string) => void;
};

const ConveyanceEmployeeSelector = ({
  employees,
  selectedEmployeeId,
  onEmployeeChange,
}: ConveyanceEmployeeSelectorProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 border-b">
        {employees.map((employee) => {
          const isSelected =
            employee.id === selectedEmployeeId;

          return (
            <button
              key={employee.id}
              type="button"
              onClick={() =>
                onEmployeeChange(employee.id)
              }
              className={[
                "relative px-4 py-3 text-sm font-medium transition-colors",
                "hover:text-teal-700",
                isSelected
                  ? "text-teal-700"
                  : "text-muted-foreground",
              ].join(" ")}
            >
              <span>{employee.name}</span>

              {isSelected && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-teal-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConveyanceEmployeeSelector;
