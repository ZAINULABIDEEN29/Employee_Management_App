import React from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import Link from 'next/link';

async function getEmployees(searchParams: any) {
  const search = searchParams.search || '';
  const department = searchParams.department || '';
  const status = searchParams.status || '';
  const page = searchParams.page || '1';

  const res = await fetch(`http://localhost:3000/api/employees?search=${search}&department=${department}&status=${status}&page=${page}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return { employees: [], total: 0, pages: 1 };
  return res.json();
}

async function getDepartments() {
  const res = await fetch('http://localhost:3000/api/departments', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function EmployeesPage({ searchParams }: { searchParams: any }) {
  const [{ employees, total, pages, currentPage }, departments] = await Promise.all([
    getEmployees(searchParams),
    getDepartments()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage and track your organization's workforce.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="card space-y-4">
        {/* Filters and Search */}
        <form className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              name="search"
              type="text" 
              defaultValue={searchParams.search}
              placeholder="Search by name, email or ID..." 
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select name="department" defaultValue={searchParams.department} className="input appearance-none pr-10 min-w-[160px]">
                <option value="">All Departments</option>
                {departments.map((dept: any) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
            </div>
            <div className="relative">
              <select name="status" defaultValue={searchParams.status} className="input appearance-none pr-10 min-w-[140px]">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
            </div>
            <button type="submit" className="btn btn-primary px-4">Filter</button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Dept & Position</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {employees.length > 0 ? employees.map((emp: any) => (
                <tr key={emp._id} className="hover:bg-[var(--muted)]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{emp.position}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{emp.department?.name || 'No Dept'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      emp.status === 'Active' ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : 
                      emp.status === 'On Leave' ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    )}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted-foreground)] hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    No employees found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing <span className="font-semibold text-[var(--foreground)]">{employees.length}</span> of <span className="font-semibold text-[var(--foreground)]">{total}</span> employees
          </p>
          <div className="flex gap-2">
            <Link 
              href={`?page=${currentPage - 1}`}
              className={cn(
                "p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-all",
                currentPage <= 1 && "pointer-events-none opacity-50"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link 
              href={`?page=${currentPage + 1}`}
              className={cn(
                "p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-all",
                currentPage >= pages && "pointer-events-none opacity-50"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
