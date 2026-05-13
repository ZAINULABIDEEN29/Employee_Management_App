'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Wallet, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/dashboard/employees', icon: Users },
  { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
  { name: 'Payroll', href: '/dashboard/payroll', icon: Wallet },
  { name: 'Roles', href: '/dashboard/roles', icon: ShieldCheck },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen?.(false)}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 relative">
          <button 
            className="lg:hidden absolute top-6 right-4 p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-lg transition-colors"
            onClick={() => setIsOpen?.(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/30">
              <Users className="text-[var(--primary-foreground)] w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
              EMS Admin
            </span>
          </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen?.(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md shadow-[var(--primary)]/20" 
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", isActive ? "" : "group-hover:text-[var(--primary)]")} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[var(--border)]">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
      </aside>
    </>
  );
}
