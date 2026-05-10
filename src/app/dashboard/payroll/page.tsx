import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';

async function getPayrollData() {
  await dbConnect();
  const employees = await Employee.find({ status: 'Active' }).sort({ lastName: 1 });
  
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.salary / 12), 0);
  const totalTax = totalPayrollData.totalMonthlyPayroll * 0.15; // Mock tax calculation

  return {
    employees,
    totalMonthlyPayroll,
    totalTax
  };
}

const totalPayrollData = {
  totalMonthlyPayroll: 0, // Placeholder for logic
};

export default async function PayrollPage() {
  await dbConnect();
  const employees = await Employee.find({ status: 'Active' }).sort({ lastName: 1 });
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.salary / 12), 0);
  const totalTax = totalMonthlyPayroll * 0.15;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Track salary disbursements and financial records.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl shadow-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +2.4%
            </span>
          </div>
          <p className="text-white/80 text-sm font-medium">Monthly Disbursement</p>
          <h2 className="text-3xl font-bold mt-1">${Math.round(totalMonthlyPayroll).toLocaleString()}</h2>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[var(--muted)] text-[var(--primary)] rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[var(--muted-foreground)]">May 2026</span>
          </div>
          <p className="text-[var(--muted-foreground)] text-sm font-medium">Next Pay Date</p>
          <h2 className="text-3xl font-bold mt-1">May 31, 2026</h2>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -1.2%
            </span>
          </div>
          <p className="text-[var(--muted-foreground)] text-sm font-medium">Est. Tax Deductions</p>
          <h2 className="text-3xl font-bold mt-1">${Math.round(totalTax).toLocaleString()}</h2>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Upcoming Disbursements</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              placeholder="Search by employee name..." 
              className="input pl-10 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Employee</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Position</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Base Monthly</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {employees.length > 0 ? employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-sm">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{emp.position}</td>
                  <td className="px-6 py-4 font-bold text-sm text-[var(--foreground)]">
                    ${Math.round(emp.salary / 12).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 rounded-full text-xs font-semibold">
                      Upcoming
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    No active employees for payroll.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
