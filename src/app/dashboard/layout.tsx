'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300 w-full overflow-x-hidden">
        <Header setIsOpen={setIsSidebarOpen} />
        <main className="p-4 sm:p-8 flex-1 animate-in max-w-[100vw]">
          {children}
        </main>
      </div>
    </div>
  );
}
