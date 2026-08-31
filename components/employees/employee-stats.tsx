import React from 'react'
import { Card, CardContent } from '../ui/card'
import { UserCheck, Users, UserX } from 'lucide-react'

interface EmployeeStatsProps {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
}

const EmployeeStats = ({ totalEmployees, activeEmployees, inactiveEmployees }: EmployeeStatsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
        {/* Total */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100">
              <Users className="size-5 text-slate-600" />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Employees</p>

              <p className="text-2xl font-bold">{totalEmployees}</p>
            </div>
          </CardContent>
        </Card>

        {/* Active */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-green-50">
              <UserCheck className="size-5 text-green-600" />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Active Employees</p>

              <p className="text-2xl font-bold">{activeEmployees}</p>
            </div>
          </CardContent>
        </Card>

        {/* Inactive */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-red-50">
              <UserX className="size-5 text-red-600" />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Inactive Employees
              </p>

              <p className="text-2xl font-bold">{inactiveEmployees}</p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default EmployeeStats
