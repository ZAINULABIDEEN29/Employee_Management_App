import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Payroll from '@/models/Payroll';
import PayrollClient from './PayrollClient';

export default async function PayrollPage(props: { searchParams: Promise<any> }) {
  await dbConnect();
  
  const searchParams = await props.searchParams;
  const targetMonth = searchParams.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Fetch all active employees
  const employees = await Employee.find({ status: 'Active' }).select('_id firstName lastName position salary').sort({ lastName: 1 }).lean() as any[];
  
  // Fetch payrolls for the current month
  const payrollsForMonth = await Payroll.find({ month: targetMonth }).lean();
  const paidEmployeeIds = payrollsForMonth.map((p: any) => p.employee.toString());

  // Calculate metrics based on actual + projected disbursements
  let totalMonthlyDisbursed = 0;
  let totalTaxDeducted = 0;

  // Add up what HAS been paid
  payrollsForMonth.forEach((p: any) => {
    totalMonthlyDisbursed += p.netSalary;
    totalTaxDeducted += p.deductions;
  });

  // Add up projections for what HAS NOT been paid
  employees.forEach(emp => {
    if (!paidEmployeeIds.includes(emp._id.toString())) {
      const baseMonthly = emp.salary / 12;
      const estimatedTax = baseMonthly * 0.15; // 15% estimated
      totalMonthlyDisbursed += (baseMonthly - estimatedTax);
      totalTaxDeducted += estimatedTax;
    }
  });

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage disbursements and bonuses for {targetMonth}.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
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
              {payrollsForMonth.length} / {employees.length} Paid
            </span>
          </div>
          <p className="text-white/80 text-sm font-medium">Est. Monthly Disbursement</p>
          <h2 className="text-3xl font-bold mt-1">${Math.round(totalMonthlyDisbursed).toLocaleString()}</h2>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[var(--muted)] text-[var(--primary)] rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[var(--muted-foreground)]">{targetMonth}</span>
          </div>
          <p className="text-[var(--muted-foreground)] text-sm font-medium">Payroll Period</p>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 truncate">{targetMonth}</h2>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[var(--muted-foreground)] text-sm font-medium">Est. Tax Deductions</p>
          <h2 className="text-3xl font-bold mt-1">${Math.round(totalTaxDeducted).toLocaleString()}</h2>
        </div>
      </div>

      <PayrollClient 
        employees={JSON.parse(JSON.stringify(employees))}
        paidEmployeeIds={paidEmployeeIds}
        targetMonth={targetMonth}
      />
    </div>
  );
}
