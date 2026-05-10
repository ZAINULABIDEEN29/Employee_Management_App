import React from 'react';
import { 
  Settings, 
  Shield, 
  Users, 
  Building2, 
  Bell, 
  Globe, 
  Database,
  Lock,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Configure global organization settings and controls.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold mb-6">Organization Profile</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input type="text" defaultValue="TechCorp Solutions" className="input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Domain</label>
                  <input type="text" defaultValue="techcorp.com" className="input" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <input type="email" defaultValue="admin@techcorp.com" className="input" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-6">Security & Auth</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--muted)]/50 rounded-xl group cursor-pointer hover:bg-[var(--muted)] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--card)] text-[var(--primary)] rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Enforce 2FA for all admin accounts</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative p-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--muted)]/50 rounded-xl group cursor-pointer hover:bg-[var(--muted)] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--card)] text-[var(--primary)] rounded-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Password Policy</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Min 12 characters, symbols required</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button className="btn btn-secondary px-8">Reset to Defaults</button>
            <button className="btn btn-primary px-8">Save Configuration</button>
          </div>
        </div>

        {/* System Stats / Logs */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold mb-6">System Health</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Database</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Storage</span>
                <span className="text-sm font-bold">14.2 GB / 50 GB</span>
              </div>
              <div className="w-full bg-[var(--muted)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--primary)] h-full w-[28%]"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">API Usage</span>
                <span className="text-sm font-bold">4.2k / 10k (Daily)</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-[var(--muted)] to-[var(--card)]">
            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-white dark:hover:bg-white/5 rounded-lg text-sm flex items-center justify-between group transition-all">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[var(--primary)]" />
                  Backup Data
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full text-left p-3 hover:bg-white dark:hover:bg-white/5 rounded-lg text-sm flex items-center justify-between group transition-all">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--primary)]" />
                  Audit Logs
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
