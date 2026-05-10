'use client';

import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Mail,
  Camera,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Languages,
  Check
} from 'lucide-react';
import { cn } from '../../../lib/utils';

type TabType = 'profile' | 'security' | 'notifications' | 'privacy' | 'language';

export default function EmployeeSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'language', name: 'Language', icon: Globe },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20" 
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-lg font-bold mb-6">Public Profile</h2>
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      JD
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-md text-[var(--accent)] hover:bg-[var(--muted)] transition-all">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <input type="text" defaultValue="John" className="input" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <input type="text" defaultValue="Doe" className="input" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <input type="email" defaultValue="john.doe@company.com" className="input pl-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-bold mb-6">Password & Security</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                      <input type="password" placeholder="••••••••" className="input pl-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input type="password" placeholder="••••••••" className="input" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="input" />
                    </div>
                  </div>
                  <button className="btn bg-[var(--accent)] text-white w-fit px-6">Update Password</button>
                </div>
              </div>

              <div className="card border-l-4 border-l-emerald-500">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Two-Factor Authentication</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button className="text-[var(--accent)] font-bold text-sm hover:underline">Enable</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-bold mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                {[
                  { title: 'Email Notifications', desc: 'Daily summary and direct messages', active: true },
                  { title: 'Browser Push', desc: 'Real-time alerts for tasks and reports', active: false },
                  { title: 'SMS Alerts', desc: 'Critical security updates via mobile', active: false },
                  { title: 'Marketing', desc: 'News and company updates', active: true },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-4 bg-[var(--muted)]/50 rounded-xl">
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{item.desc}</p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative cursor-pointer p-1 transition-all",
                      item.active ? "bg-[var(--accent)]" : "bg-slate-300 dark:bg-slate-700"
                    )}>
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-all",
                        item.active ? "ml-auto" : "ml-0"
                      )}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="card">
              <h2 className="text-lg font-bold mb-6">Privacy & Visibility</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[var(--muted)]/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[var(--card)] text-[var(--accent)] rounded-lg">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Public Profile</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Make your profile visible to other employees</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative cursor-pointer p-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--muted)]/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[var(--card)] text-[var(--accent)] rounded-lg">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Online Status</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Show when you are currently active</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer p-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="card">
              <h2 className="text-lg font-bold mb-6">Regional & Language</h2>
              <div className="space-y-4">
                {[
                  { name: 'English (US)', code: 'en-US', active: true },
                  { name: 'Spanish (ES)', code: 'es-ES', active: false },
                  { name: 'French (FR)', code: 'fr-FR', active: false },
                  { name: 'German (DE)', code: 'de-DE', active: false },
                ].map((lang) => (
                  <button 
                    key={lang.code}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                      lang.active 
                        ? "border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)]" 
                        : "border-[var(--border)] hover:bg-[var(--muted)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium text-sm">{lang.name}</span>
                    </div>
                    {lang.active && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button className="btn btn-secondary px-8">Discard</button>
            <button className="btn bg-[var(--accent)] text-white px-8 shadow-lg shadow-[var(--accent)]/20">Save All Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
