import Link from 'next/link';
import { ArrowRight, Users, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-3xl space-y-8 animate-in relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold mb-4 mx-auto">
          <ShieldCheck className="w-4 h-4" />
          Secure Admin System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Manage your <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">Workforce</span> <br />
          with intelligence.
        </h1>
        
        <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
          The all-in-one platform for employee records, department management, and payroll tracking. Built for modern organizations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard" className="btn btn-primary px-8 py-4 text-lg flex items-center gap-2 group">
            Admin Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/employee/dashboard" className="btn btn-secondary px-8 py-4 text-lg flex items-center gap-2 group">
            Employee Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="card glass">
            <Users className="w-8 h-8 text-[var(--primary)] mb-4" />
            <h3 className="font-bold mb-2">Employee CRUD</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Complete management of employee lifecycle and records.</p>
          </div>
          <div className="card glass">
            <ShieldCheck className="w-8 h-8 text-[var(--accent)] mb-4" />
            <h3 className="font-bold mb-2">Role Management</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Granular access control for different administrative levels.</p>
          </div>
          <div className="card glass">
            <Users className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="font-bold mb-2">Department Tracking</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Organize your organization into efficient business units.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
