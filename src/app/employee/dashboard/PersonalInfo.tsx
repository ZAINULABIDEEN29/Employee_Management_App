'use client';

import React, { useState, useTransition } from 'react';
import { User, Mail, Phone, Building2, TrendingUp, Calendar, Loader2, Save, X } from 'lucide-react';
import { updatePersonalInfo } from './actions';

interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentName: string;
  position: string;
  joinDate: string;
}

export default function PersonalInfo({
  firstName,
  lastName,
  email,
  phone,
  departmentName,
  position,
  joinDate
}: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await updatePersonalInfo(formData);
      if (res.success) {
        setIsEditing(false);
      } else {
        setErrorMsg(res.error || 'Failed to update profile');
      }
    });
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-[var(--border)] pb-4 sm:border-0 sm:pb-0">
        <h2 className="text-xl font-bold">Personal Information</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-[var(--accent)] text-sm font-semibold hover:underline self-start sm:self-auto"
          >
            Edit Info
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
          {errorMsg}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs text-[var(--muted-foreground)]">Full Name</p>
                <p className="font-semibold truncate">{firstName} {lastName}</p>
              </div>
            </div>
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs text-[var(--muted-foreground)]">Email Address</p>
                <p className="font-semibold truncate" title={email}>{email}</p>
              </div>
            </div>
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Phone Number</p>
                {isEditing ? (
                  <input 
                    name="phone"
                    defaultValue={phone}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--accent)] rounded-lg px-3 py-1.5 outline-none transition-colors text-sm font-medium"
                    placeholder="+1 (555) 000-0000"
                    autoFocus
                  />
                ) : (
                  <p className="font-semibold truncate">{phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs text-[var(--muted-foreground)]">Department</p>
                <p className="font-semibold truncate">{departmentName}</p>
              </div>
            </div>
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs text-[var(--muted-foreground)]">Position</p>
                <p className="font-semibold truncate">{position}</p>
              </div>
            </div>
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs text-[var(--muted-foreground)]">Join Date</p>
                <p className="font-semibold truncate">{new Date(joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 pt-4 border-t border-[var(--border)] flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-xl shadow-lg shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
