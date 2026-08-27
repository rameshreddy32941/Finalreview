'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Mail, ArrowRight, AlertCircle, CheckCircle2, Heart, Brain, Shield } from 'lucide-react';
import { getAuthErrorMessage, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setError(getAuthErrorMessage(error));
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Medical background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 -left-40 h-96 w-96 rounded-full bg-chart-2/6 blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 rounded-full bg-chart-4/4 blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Activity className="h-5 w-5" />
                <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
              </div>
            </Link>
            <h1 className="mt-4 text-2xl font-bold">Reset Password</h1>
            <p className="mt-1 text-sm text-muted-foreground">We'll send you a reset link</p>
          </div>

          {sent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary animate-scale-in">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                If an account exists for {email}, a password reset link has been sent. Check your inbox.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input pl-10" required />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2 shadow-lg shadow-primary/30" disabled={loading}>
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" /> Secure
          </div>
          <div className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-chart-2" /> AI-Powered
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-chart-4" /> SDG 3
          </div>
        </div>
      </div>
    </div>
  );
}
