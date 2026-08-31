import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const EmployeeFilters = ({ search, setSearch, department, setDepartment, status, setStatus }: { search: string; setSearch: (search: string) => void; department: string; setDepartment: (department: string) => void; status: string; setStatus: (status: string) => void }) => {
  return (
     <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by name, ID or designation..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Department */}
            <Select
              value={department}
              onValueChange={(value) => setDepartment(value ?? "all")}
            >
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Department" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>

                <SelectItem value="Management">Management</SelectItem>

                <SelectItem value="Merchandising">Merchandising</SelectItem>

                <SelectItem value="Accounts">Accounts</SelectItem>

                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select
              value={status}
              onValueChange={(value) => setStatus(value ?? "all")}
            >
              <SelectTrigger className="w-full md:w-35">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>

                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
  )
}

export default EmployeeFilters
