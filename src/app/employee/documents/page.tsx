import React from 'react';
import { 
  FileText, 
  Search, 
  ArrowDownToLine, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const documents = [
  { id: '1', name: 'Employment Contract.pdf', type: 'Contract', date: '2023-01-15', size: '1.2 MB', status: 'Signed' },
  { id: '2', name: 'Employee Handbook 2026.pdf', type: 'Policy', date: '2026-01-01', size: '3.4 MB', status: 'Read' },
  { id: '3', name: 'Health Insurance Policy.pdf', type: 'Benefits', date: '2025-12-20', size: '2.1 MB', status: 'Signed' },
  { id: '4', name: 'Performance Review Q1.pdf', type: 'Review', date: '2026-04-10', size: '850 KB', status: 'Pending Signature' },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Access your contracts, policies, and official records.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Archive
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input 
            type="text" 
            placeholder="Search documents by name or type..." 
            className="input pl-10"
          />
        </div>
        <select className="input md:w-48">
          <option value="">All Categories</option>
          <option value="contract">Contracts</option>
          <option value="policy">Policies</option>
          <option value="review">Reviews</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="card group hover:border-[var(--accent)] transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--muted)] text-[var(--accent)] rounded-xl group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-[var(--accent)] transition-colors">{doc.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-all">
                <ArrowDownToLine className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="text-xs text-[var(--muted-foreground)]">Updated {doc.date}</span>
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                doc.status === 'Signed' || doc.status === 'Read' 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
              )}>
                {doc.status === 'Signed' || doc.status === 'Read' ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {doc.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
