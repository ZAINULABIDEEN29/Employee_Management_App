import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Wallet,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import PersonalInfo from './PersonalInfo';

export default async function EmployeeDashboard() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  await dbConnect();
  
  const employee = await Employee.findOne({ email: session.user.email })
    .populate('department', 'name')
    .lean();

  if (!employee) {
    redirect('/login');
  }

  const { firstName, lastName, email, phone, position, joinDate, status, salary } = employee as any;
  const departmentName = employee.department?.name || 'Unassigned';

  const monthlySalary = salary ? (salary / 12) : 0;
  
  // Generate mock salary history based on their actual salary
  const today = new Date();
  const salaryHistory = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 0);
    return {
      month: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
      amount: `$${monthlySalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: 'Paid',
      date: `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-white overflow-hidden shadow-xl shadow-[var(--accent)]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {firstName}!</h1>
          <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">Here is what's happening with your profile today.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 w-fit">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Shift: 09:00 AM - 05:00 PM</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 w-fit">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{new Date().toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Card */}
        <div className="xl:col-span-2 space-y-6 sm:space-y-8">
          <PersonalInfo 
            firstName={firstName} 
            lastName={lastName} 
            email={email} 
            phone={phone} 
            departmentName={departmentName} 
            position={position} 
            joinDate={joinDate} 
          />

          {/* Salary Summary Chart */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Salary History</h2>
              <button className="text-[var(--accent)] text-sm font-semibold hover:underline">Download All</button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {salaryHistory.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--muted)]/50 rounded-xl hover:bg-[var(--muted)] transition-all group gap-4 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-[var(--card)] rounded-lg flex items-center justify-center text-[var(--accent)] shadow-sm shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.month}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Deposit on {item.date}</p>
                    </div>
                  </div>
                  <div className="sm:text-right flex items-center justify-between sm:block">
                    <span className="text-[10px] sm:hidden uppercase tracking-wider font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                      {item.status}
                    </span>
                    <div>
                      <p className="font-bold text-sm">{item.amount}</p>
                      <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-bold text-emerald-500">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6 sm:space-y-8">
          <div className="card bg-[var(--card)]">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold">Your Status</h2>
               <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                  status === 'Active' ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : 
                  status === 'On Leave' ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  {status}
                </span>
            </div>
            
            <h2 className="text-lg font-bold mb-4 mt-6">Your Benefits</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-4 border border-[var(--border)] rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Health Insurance</span>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">Premium Plan (Family)</p>
              </div>
              <div className="p-4 border border-[var(--border)] rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Leave Balance</span>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">14 Days</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">Paid Time Off remaining</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-[var(--muted)] to-[var(--card)] border-[var(--accent)]/20">
            <h2 className="text-lg font-bold mb-6">Upcoming Holidays</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--card)] flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-[10px] font-bold text-[var(--accent)]">MAY</span>
                    <span className="text-sm font-bold leading-none">25</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Memorial Day</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Monday</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--card)] flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-[10px] font-bold text-[var(--accent)]">JUN</span>
                    <span className="text-sm font-bold leading-none">19</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Juneteenth</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Friday</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
