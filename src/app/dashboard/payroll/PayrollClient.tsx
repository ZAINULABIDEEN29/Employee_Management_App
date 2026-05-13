'use client';

import React, { useState, useTransition } from 'react';
import { Search, DollarSign, Loader2, CheckCircle2, X } from 'lucide-react';
import { releaseSalary } from './actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  salary: number;
}

interface PayrollClientProps {
  employees: Employee[];
  paidEmployeeIds: string[];
  targetMonth: string;
}

export default function PayrollClient({ employees, paidEmployeeIds, targetMonth }: PayrollClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  
  const [bonus, setBonus] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (emp: Employee) => {
    setSelectedEmp(emp);
    setBonus(0);
    // Auto calculate 15% tax deduction for mock purposes
    setDeductions(Math.round((emp.salary / 12) * 0.15));
    setErrorMsg('');
  };

  const handleRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    setErrorMsg('');
    const baseSalary = Math.round(selectedEmp.salary / 12);

    startTransition(async () => {
      const res = await releaseSalary(selectedEmp._id, targetMonth, baseSalary, bonus, deductions);
      if (res.success) {
        setSelectedEmp(null);
      } else {
        setErrorMsg(res.error || 'Failed to release salary.');
      }
    });
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold">Disbursements for {targetMonth}</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input 
            type="text" 
            placeholder="Search by employee name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 py-1.5 text-sm w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 sm:mx-0 sm:rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
              <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase whitespace-nowrap">Employee</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase whitespace-nowrap">Position</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase whitespace-nowrap">Base Monthly</th>
              <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase text-right whitespace-nowrap">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => {
              const isPaid = paidEmployeeIds.includes(emp._id);
              const baseMonthly = Math.round(emp.salary / 12);
              
              return (
                <tr key={emp._id} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-sm whitespace-nowrap">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 text-sm text-[var(--muted-foreground)] whitespace-nowrap">{emp.position}</td>
                  <td className="px-6 py-4 font-bold text-sm text-[var(--foreground)] whitespace-nowrap">
                    ${baseMonthly.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Paid
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="btn btn-primary py-1.5 px-4 text-xs font-bold shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Release Salary
                      </button>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                  No active employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Release Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[var(--card)]/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold">Release Salary</h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{targetMonth}</p>
              </div>
              <button onClick={() => setSelectedEmp(null)} className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--muted-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4 bg-[var(--muted)]/50 p-4 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {selectedEmp.firstName[0]}{selectedEmp.lastName[0]}
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">{selectedEmp.firstName} {selectedEmp.lastName}</p>
                <p className="text-sm text-[var(--muted-foreground)]">Base: ${Math.round(selectedEmp.salary / 12).toLocaleString()}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRelease} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Additional Bonus ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <input 
                    type="number" 
                    min="0"
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                    className="input pl-9 py-2.5 w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Deductions / Taxes ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <input 
                    type="number" 
                    min="0"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    className="input pl-9 py-2.5 w-full text-red-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[var(--border)]">
                <span className="font-semibold text-[var(--muted-foreground)]">Total Net Pay</span>
                <span className="text-2xl font-bold text-emerald-500">
                  ${(Math.round(selectedEmp.salary / 12) + bonus - deductions).toLocaleString()}
                </span>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setSelectedEmp(null)} className="flex-1 py-3 rounded-xl font-semibold bg-[var(--muted)] hover:brightness-95 transition-all">Cancel</button>
                <button type="submit" disabled={isPending} className="flex-1 py-3 rounded-xl font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
