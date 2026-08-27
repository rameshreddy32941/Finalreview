'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Mail, Lock, User, ArrowRight, AlertCircle, MapPin, Calendar, Heart, Brain, Shield } from 'lucide-react';
import { getAuthErrorMessage, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const numericAge = age ? Number(age) : null;
    if (numericAge !== null && (numericAge < 5 || numericAge > 120)) {
      setError('Please enter an age between 5 and 120.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          age: numericAge,
          gender: gender || null,
          city: city.trim() || null,
          allergies: allergies.trim() || null,
          conditions: conditions.trim() || null,
        },
      },
    });

    if (error) {
      setError(getAuthErrorMessage(error));
      setLoading(false);
      return;
    }

    if (data.user) {
      if (data.session) {
        // A session is available when email confirmation is disabled.
        // AuthProvider also makes this safe on the first later login.
        router.push('/dashboard');
        return;
      }

      setSuccess('Account created. Please check your email and confirm your address before signing in.');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Medical background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-chart-2/6 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-chart-4/4 blur-3xl animate-float-slow" />
      </div>

      <div className="relative z-10 w-full max-w-lg animate-scale-in">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Activity className="h-5 w-5" />
                <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
              </div>
            </Link>
            <h1 className="mt-4 text-2xl font-bold">Create Your Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join HumanSenses to start your health journey</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="glass-input pl-10" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input pl-10" required minLength={6} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="age" type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} className="glass-input pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="glass-input"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="city" placeholder="Your city" value={city} onChange={(e) => setCity(e.target.value)} className="glass-input pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies (optional)</Label>
                <Input id="allergies" placeholder="e.g., pollen, dust" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="glass-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conditions">Conditions (optional)</Label>
                <Input id="conditions" placeholder="e.g., diabetes" value={conditions} onChange={(e) => setConditions(e.target.value)} className="glass-input" />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 shadow-lg shadow-primary/30" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
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
