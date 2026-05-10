import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  MoreVertical,
  Edit2,
  Trash2,
  Info
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const roles = [
  { 
    name: 'Super Admin', 
    description: 'Full system access, manage all settings and users.',
    users: 2,
    permissions: ['all_access', 'manage_admins', 'billing', 'reports']
  },
  { 
    name: 'Department Manager', 
    description: 'Manage specific department employees and payroll.',
    users: 8,
    permissions: ['view_dept', 'edit_dept_employees', 'view_reports']
  },
  { 
    name: 'HR Specialist', 
    description: 'Manage employee records, documents and recruitment.',
    users: 5,
    permissions: ['manage_employees', 'view_documents', 'edit_profile']
  },
  { 
    name: 'Finance Viewer', 
    description: 'Read-only access to payroll and financial reports.',
    users: 3,
    permissions: ['view_payroll', 'export_reports']
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Define permissions and access levels for administrative staff.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.name} className="card group hover:border-[var(--primary)] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{role.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">{role.users} Users assigned</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
              {role.description}
            </p>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Key Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <span key={perm} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--muted)] rounded-lg text-[11px] font-medium text-[var(--foreground)] border border-[var(--border)]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {perm.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <button className="text-sm font-semibold text-[var(--primary)] hover:underline flex items-center gap-2">
                View Full Permissions
                <Info className="w-4 h-4" />
              </button>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--card)] bg-[var(--muted)] flex items-center justify-center text-[10px] font-bold">
                    U{i}
                  </div>
                ))}
                {role.users > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--card)] bg-[var(--muted)] flex items-center justify-center text-[10px] font-bold">
                    +{role.users - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
