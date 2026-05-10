import React from 'react';
import { 
  Wallet, 
  ArrowDownToLine, 
  Search, 
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const salaryHistory = [
  { id: '1', month: 'April 2026', base: 6500, bonus: 500, deductions: 250, total: 6750, date: '2026-04-30', status: 'Paid' },
  { id: '2', month: 'March 2026', base: 6500, bonus: 0, deductions: 250, total: 6250, date: '2026-03-31', status: 'Paid' },
  { id: '3', month: 'February 2026', base: 6500, bonus: 200, deductions: 250, total: 6450, date: '2026-02-28', status: 'Paid' },
  { id: '4', month: 'January 2026', base: 6500, bonus: 0, deductions: 250, total: 6250, date: '2026-01-31', status: 'Paid' },
];

export default function MySalaryPage() {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Salary</h1>
          <p className="text-[var(--muted-foreground)] mt-1">View your earnings, bonuses, and tax statements.</p>
        </div>
        <button className="btn bg-[var(--accent)] text-white hover:brightness-110 flex items-center gap-2 w-fit">
          <ArrowDownToLine className="w-4 h-4" />
          Download All Statements
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-[var(--card)] border-l-4 border-l-[var(--accent)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Net Annual Salary</p>
              <h2 className="text-2xl font-bold">$78,000.00</h2>
            </div>
          </div>
        </div>

        <div className="card bg-[var(--card)] border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Last Bonus</p>
              <h2 className="text-2xl font-bold">$500.00</h2>
            </div>
          </div>
        </div>

        <div className="card bg-[var(--card)] border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Payment Method</p>
              <h2 className="text-2xl font-bold">Bank Transfer</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Earnings History</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              placeholder="Filter by month..." 
              className="input pl-10 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Pay Period</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Base Pay</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Bonus</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Deductions</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase">Total Net</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase text-right">Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {salaryHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-sm">{item.month}</td>
                  <td className="px-6 py-4 text-sm">${item.base.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-emerald-500 font-medium">+${item.bonus.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-red-500 font-medium">-${item.deductions.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-sm text-[var(--foreground)]">
                    ${item.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--accent)] transition-all">
                      <ArrowDownToLine className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
