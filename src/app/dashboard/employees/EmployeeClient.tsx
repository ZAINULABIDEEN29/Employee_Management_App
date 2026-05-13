'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, Edit2, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight, X, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createEmployee, updateEmployee, deleteEmployee } from './actions';

type Employee = any;
type Department = any;

interface EmployeeClientProps {
  employees: Employee[];
  departments: Department[];
  total: number;
  pages: number;
  currentPage: number;
  searchParams: any;
}

export default function EmployeeClient({ 
  employees, departments, total, pages, currentPage, searchParams 
}: EmployeeClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Modal States
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenModal = (employee?: Employee) => {
    setEditingEmployee(employee || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    if (deleteConfirmId) {
      startTransition(async () => {
        await deleteEmployee(deleteConfirmId);
        setDeleteConfirmId(null);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingEmployee) {
      res = await updateEmployee(editingEmployee._id, formData);
    } else {
      res = await createEmployee(formData);
    }
    
    setIsSubmitting(false);
    
    if (res.success) {
      handleCloseModal();
    } else {
      setErrorMsg(res.error || 'Something went wrong while processing the request.');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 only if we are changing a filter/search, not the page itself
    if (key !== 'page') {
      params.delete('page'); 
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  let searchTimeout: NodeJS.Timeout;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      handleFilterChange('search', value);
    }, 400); // 400ms debounce
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage and track your organization's workforce.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center gap-2 w-fit hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="card space-y-4 shadow-sm border border-[var(--border)]">
        {/* Filters and Search - Auto updating */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
            <input 
              type="text" 
              defaultValue={searchParams.search}
              onChange={handleSearch}
              placeholder="Search by name, email or ID..." 
              className="input pl-10 focus:ring-2 focus:ring-[var(--primary)]/20 transition-shadow w-full"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select 
                defaultValue={searchParams.department} 
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="input appearance-none pr-10 min-w-[160px] focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((dept: any) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                defaultValue={searchParams.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input appearance-none pr-10 min-w-[140px] focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6 relative">
          {isPending && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap">Employee</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap">Dept & Position</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap">Join Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {employees.length > 0 ? employees.map((emp: any) => (
                <tr key={emp._id} className="hover:bg-[var(--muted)]/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium">{emp.position}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{emp.department?.name || 'No Dept'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold inline-block",
                      emp.status === 'Active' ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : 
                      emp.status === 'On Leave' ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    )}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--muted-foreground)] whitespace-nowrap">
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewingEmployee(emp)}
                        className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted-foreground)] hover:text-blue-500 transition-all hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all hover:scale-110"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted-foreground)] hover:text-red-500 transition-all hover:scale-110"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    <div className="flex flex-col items-center justify-center opacity-70">
                      <Search className="w-10 h-10 mb-3" />
                      <p>No employees found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing <span className="font-semibold text-[var(--foreground)]">{employees.length}</span> of <span className="font-semibold text-[var(--foreground)]">{total}</span> employees
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => handleFilterChange('page', (currentPage - 1).toString())}
              disabled={currentPage <= 1 || isPending}
              className={cn(
                "p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-all active:scale-95",
                (currentPage <= 1 || isPending) && "pointer-events-none opacity-50"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleFilterChange('page', (currentPage + 1).toString())}
              disabled={currentPage >= pages || isPending}
              className={cn(
                "p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-all active:scale-95",
                (currentPage >= pages || isPending) && "pointer-events-none opacity-50"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[var(--card)]/95 backdrop-blur-xl w-full max-w-2xl rounded-[2rem] shadow-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 overflow-y-auto max-h-[95vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5 dark:border-white/5">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-purple-500 bg-clip-text text-transparent">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  {editingEmployee ? 'Update the details for this employee below.' : 'Fill in the details to add a new employee to the system.'}
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">First Name</label>
                  <input required name="firstName" defaultValue={editingEmployee?.firstName} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" placeholder="e.g. Jane" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Last Name</label>
                  <input required name="lastName" defaultValue={editingEmployee?.lastName} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" placeholder="e.g. Doe" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Email Address</label>
                  <input required name="email" type="email" defaultValue={editingEmployee?.email} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" placeholder="jane.doe@company.com" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Phone Number</label>
                  <input required name="phone" type="tel" defaultValue={editingEmployee?.phone} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Employee ID</label>
                  <input required name="employeeId" defaultValue={editingEmployee?.employeeId} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" placeholder="e.g. EMP-1024" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Salary ($)</label>
                  <input required name="salary" type="number" min="0" step="1000" defaultValue={editingEmployee?.salary} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" placeholder="e.g. 75000" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Department</label>
                  <select required name="department" defaultValue={editingEmployee?.department?._id || editingEmployee?.department} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Select a department</option>
                    {departments.map((dept: any) => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Position</label>
                  <input required name="position" defaultValue={editingEmployee?.position} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" placeholder="e.g. Senior Designer" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Status</label>
                  <select required name="status" defaultValue={editingEmployee?.status || 'Active'} className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all appearance-none cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[var(--foreground)]/90">Join Date</label>
                  <input 
                    required 
                    name="joinDate" 
                    type="date" 
                    defaultValue={editingEmployee?.joinDate ? new Date(editingEmployee.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
                    className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 rounded-xl px-4 py-3 outline-none transition-all" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 mt-4 border-t border-black/5 dark:border-white/5">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-6 py-3 font-semibold rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--foreground)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {editingEmployee ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[var(--card)]/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Delete Employee</h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-[var(--foreground)]/80 mb-8">Are you sure you want to permanently delete this employee? All of their data will be removed from our servers.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirmId(null)} className="px-5 py-2.5 rounded-xl font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={executeDelete} className="px-5 py-2.5 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[var(--card)]/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5">
              <h3 className="text-2xl font-bold">Employee Details</h3>
              <button onClick={() => setViewingEmployee(null)} className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {viewingEmployee.firstName[0]}{viewingEmployee.lastName[0]}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{viewingEmployee.firstName} {viewingEmployee.lastName}</h4>
                  <p className="text-[var(--primary)] font-medium">{viewingEmployee.position}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Employee ID</p>
                  <p className="font-medium mt-1">{viewingEmployee.employeeId}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Department</p>
                  <p className="font-medium mt-1">{viewingEmployee.department?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Email</p>
                  <p className="font-medium mt-1 truncate" title={viewingEmployee.email}>{viewingEmployee.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Phone</p>
                  <p className="font-medium mt-1">{viewingEmployee.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Salary</p>
                  <p className="font-medium mt-1">${viewingEmployee.salary?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Join Date</p>
                  <p className="font-medium mt-1">{new Date(viewingEmployee.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
               <span className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold inline-block shadow-sm",
                  viewingEmployee.status === 'Active' ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : 
                  viewingEmployee.status === 'On Leave' ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  Status: {viewingEmployee.status}
                </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorMsg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[var(--card)]/95 backdrop-blur-xl w-full max-w-sm rounded-3xl shadow-2xl border border-red-500/20 p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-4">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Oops! Something failed</h3>
            <p className="text-[var(--muted-foreground)] mb-6">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)} className="w-full px-5 py-3 rounded-xl font-bold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
