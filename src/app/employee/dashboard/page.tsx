import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  Wallet,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function EmployeeDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-white overflow-hidden shadow-xl shadow-[var(--accent)]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Welcome back, John!</h1>
          <p className="text-white/80 mt-2">Here is what's happening with your profile today.</p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Shift: 09:00 AM - 05:00 PM</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">May 07, 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button className="text-[var(--accent)] text-sm font-semibold hover:underline">Edit Info</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Full Name</p>
                    <p className="font-semibold">John Doe</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Email Address</p>
                    <p className="font-semibold">john.doe@company.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Phone Number</p>
                    <p className="font-semibold">+1 (555) 000-1234</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Department</p>
                    <p className="font-semibold">Engineering</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Position</p>
                    <p className="font-semibold">Senior Software Engineer</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Join Date</p>
                    <p className="font-semibold">Jan 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Summary Chart Placeholder */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Salary History</h2>
              <button className="text-[var(--accent)] text-sm font-semibold hover:underline">Download All</button>
            </div>
            <div className="space-y-4">
              {[
                { month: 'April 2026', amount: '$7,083.33', status: 'Paid', date: 'Apr 30' },
                { month: 'March 2026', amount: '$7,083.33', status: 'Paid', date: 'Mar 31' },
                { month: 'February 2026', amount: '$7,083.33', status: 'Paid', date: 'Feb 28' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[var(--muted)]/50 rounded-xl hover:bg-[var(--muted)] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-[var(--card)] rounded-lg flex items-center justify-center text-[var(--accent)] shadow-sm">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.month}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{item.amount}</p>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-8">
          <div className="card bg-[var(--card)]">
            <h2 className="text-lg font-bold mb-6">Your Benefits</h2>
            <div className="space-y-4">
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
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--card)] flex flex-col items-center justify-center shadow-sm">
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
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--card)] flex flex-col items-center justify-center shadow-sm">
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
