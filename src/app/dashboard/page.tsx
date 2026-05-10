import React from 'react';
import { Users, Building2, Wallet, TrendingUp, UserPlus, FileText } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Department from '@/models/Department';

async function getStats() {
  await dbConnect();
  
  const [employeeCount, deptCount, employees] = await Promise.all([
    Employee.countDocuments({ status: 'Active' }),
    Department.countDocuments({}),
    Employee.find({}).sort({ createdAt: -1 }).limit(5),
  ]);

  // Calculate total monthly payroll
  const totalPayroll = await Employee.aggregate([
    { $match: { status: 'Active' } },
    { $group: { _id: null, total: { $sum: "$salary" } } }
  ]);

  const monthlyPayroll = totalPayroll.length > 0 ? totalPayroll[0].total / 12 : 0;

  return {
    employeeCount,
    deptCount,
    monthlyPayroll,
    recentEmployees: employees
  };
}

export default async function DashboardPage() {
  const statsData = await getStats();

  const stats = [
    { name: 'Total Employees', value: statsData.employeeCount.toString(), icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Total Departments', value: statsData.deptCount.toString(), icon: Building2, change: '0%', changeType: 'neutral' },
    { name: 'Est. Monthly Payroll', value: `$${Math.round(statsData.monthlyPayroll).toLocaleString()}`, icon: Wallet, change: '+5.4%', changeType: 'increase' },
    { name: 'Active Projects', value: '14', icon: FileText, change: '+2', changeType: 'increase' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-[var(--muted-foreground)] mt-2">Welcome back, Admin. Here's the current organizational snapshot.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card group hover:border-[var(--primary)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[var(--muted)] text-[var(--primary)] rounded-xl group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'increase' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-[var(--muted-foreground)] font-medium text-sm">{stat.name}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Recent Hires</h2>
            <button className="text-[var(--primary)] text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {statsData.recentEmployees.length > 0 ? (
              statsData.recentEmployees.map((emp: any) => (
                <div key={emp._id} className="flex items-center justify-between p-3 hover:bg-[var(--muted)]/50 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{emp.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">Joined</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{new Date(emp.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)] text-center py-8">No recent employees found.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-4 bg-[var(--muted)] hover:bg-[var(--primary)]/10 rounded-xl transition-all text-left group">
              <div className="p-2 bg-[var(--card)] rounded-lg group-hover:bg-white transition-all">
                <UserPlus className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Add New Employee</p>
                <p className="text-xs text-[var(--muted-foreground)]">Setup a new staff record</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-[var(--muted)] hover:bg-[var(--accent)]/10 rounded-xl transition-all text-left group">
              <div className="p-2 bg-[var(--card)] rounded-lg group-hover:bg-white transition-all">
                <Building2 className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-semibold text-sm">New Department</p>
                <p className="text-xs text-[var(--muted-foreground)]">Create a new business unit</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-[var(--muted)] hover:bg-[var(--success)]/10 rounded-xl transition-all text-left group">
              <div className="p-2 bg-[var(--card)] rounded-lg group-hover:bg-white transition-all">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Generate Report</p>
                <p className="text-xs text-[var(--muted-foreground)]">Export monthly payroll data</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
