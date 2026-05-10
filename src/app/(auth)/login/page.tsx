'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        type: isAdmin ? 'admin' : 'employee',
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      } else {
        router.push(isAdmin ? '/dashboard' : '/employee/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent)] text-white shadow-xl shadow-[var(--accent)]/30 mb-4">
            {isAdmin ? <ShieldCheck className="w-8 h-8" /> : <Users className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Please enter your details to access the {isAdmin ? 'Admin' : 'Employee'} Portal
          </p>
        </div>

        <div className="card shadow-2xl border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-xl">
          {/* Portal Toggle */}
          <div className="flex p-1 bg-[var(--muted)] rounded-xl mb-8">
            <button 
              onClick={() => { setIsAdmin(false); setError(''); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                !isAdmin ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <Users className="w-4 h-4" />
              Employee
            </button>
            <button 
              onClick={() => { setIsAdmin(true); setError(''); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                isAdmin ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="input pl-10 focus:ring-2 focus:ring-[var(--accent)]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-[var(--accent)] hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="input pl-10 focus:ring-2 focus:ring-[var(--accent)]/20"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full py-6 mt-4 group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 font-bold text-lg">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </form>

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-8">
            Secured by industry standard encryption. <br />
            Need help? <a href="#" className="text-[var(--accent)] hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
