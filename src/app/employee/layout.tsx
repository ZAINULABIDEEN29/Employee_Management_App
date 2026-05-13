'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  User, 
  Wallet, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'My Profile', href: '/employee/dashboard', icon: User },
  { name: 'My Salary', href: '/employee/salary', icon: Wallet },
  { name: 'Documents', href: '/employee/documents', icon: FileText },
  { name: 'Settings', href: '/employee/settings', icon: Settings },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col z-50 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent)]/30">
                <User className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent">
                EMS Portal
              </span>
            </div>
            <button 
              className="lg:hidden p-2 -mr-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--muted)] rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20" 
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "" : "group-hover:text-[var(--accent)]")} />
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

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-20 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--muted)] rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg hidden sm:block">Employee Self Service</h2>
            <h2 className="font-bold text-lg sm:hidden text-[var(--accent)]">EMS Portal</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--muted)] rounded-lg transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--card)]"></span>
            </button>
            <div className="h-8 w-[1px] bg-[var(--border)] mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold leading-none">John Doe</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Software Engineer</p>
              </div>
              <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                JD
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1 animate-in max-w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
