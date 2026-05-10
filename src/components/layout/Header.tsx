'use client';

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search for employees, departments..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--muted)] border-transparent focus:bg-[var(--card)] focus:border-[var(--primary)] rounded-xl transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--card)]"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-[var(--border)] mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">Admin User</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold shadow-md">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
