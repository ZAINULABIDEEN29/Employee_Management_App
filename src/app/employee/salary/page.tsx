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
import { cn } from '@/lib/utils';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Payroll from '@/models/Payroll';

export default async function MySalaryPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  await dbConnect();
  const employee = await Employee.findOne({ email: session.user.email }).lean() as any;
  if (!employee) redirect('/login');

  const annualSalary = employee.salary || 0;
  
  // Fetch actual payroll history from the database
  let salaryHistory = await Payroll.find({ employee: employee._id })
    .sort({ createdAt: -1 })
    .lean() as any[];

  // Map to the format needed for the table
  let formattedHistory = salaryHistory.map((p) => ({
    id: p._id.toString(),
    month: p.month,
    base: p.baseSalary,
    bonus: p.bonus,
    deductions: p.deductions,
    total: p.netSalary,
    date: new Date(p.paymentDate).toLocaleDateString(),
    status: p.status
  }));

  const query = (searchParams?.query || '').toLowerCase();
  if (query) {
    formattedHistory = formattedHistory.filter(item => item.month.toLowerCase().includes(query));
  }

  // Calculate Last Bonus
  const lastBonusObj = formattedHistory.find(h => h.bonus > 0);
  const lastBonus = lastBonusObj ? lastBonusObj.bonus : 0;

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Salary</h1>
          <p className="text-[var(--muted-foreground)] mt-1">View your earnings, bonuses, and tax statements.</p>
        </div>
        <button className="btn bg-[var(--accent)] text-white hover:brightness-110 flex items-center gap-2 w-fit shadow-lg shadow-[var(--accent)]/20">
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
              <h2 className="text-2xl font-bold">${annualSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
              <h2 className="text-2xl font-bold">${lastBonus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold">Earnings History</h2>
          <form method="GET" className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              name="query"
              defaultValue={query}
              placeholder="Filter by month..." 
              className="input pl-10 py-1.5 text-sm w-full"
            />
          </form>
        </div>

        <div className="overflow-x-auto -mx-6 sm:mx-0 sm:rounded-xl">
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
              {formattedHistory.length > 0 ? formattedHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-sm whitespace-nowrap">{item.month}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">${item.base.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-sm text-emerald-500 font-medium whitespace-nowrap">+${item.bonus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-sm text-red-500 font-medium whitespace-nowrap">-${item.deductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 font-bold text-sm text-[var(--foreground)] whitespace-nowrap">
                    ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--accent)] transition-all" title="Download PDF">
                      <ArrowDownToLine className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    No statements found for the given filter.
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
