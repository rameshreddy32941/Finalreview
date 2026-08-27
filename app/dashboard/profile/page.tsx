'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, AlertCircle, Save, Activity, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { senseOrgans } from '@/lib/sense-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [city, setCity] = useState(profile?.city || '');
  const [allergies, setAllergies] = useState(profile?.allergies || '');
  const [conditions, setConditions] = useState(profile?.conditions || '');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAge(profile.age?.toString() || '');
      setGender(profile.gender || '');
      setCity(profile.city || '');
      setAllergies(profile.allergies || '');
      setConditions(profile.conditions || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('health_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setScores(data as unknown as Record<string, number>);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        city: city || null,
        allergies: allergies || null,
        conditions: conditions || null,
      })
      .eq('id', user.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      await refreshProfile();
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
    }
    setSaving(false);
  };

  const overall = scores.overall || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your personal information and health data</p>
      </div>

      {/* Profile summary */}
      <Card className="glass p-6 animate-fade-in-up">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary text-2xl font-bold">
            {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile?.age && <Badge variant="secondary">{profile.age} years</Badge>}
              {profile?.gender && <Badge variant="secondary" className="capitalize">{profile.gender}</Badge>}
              {profile?.city && <Badge variant="secondary">{profile.city}</Badge>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{overall}</div>
            <p className="text-xs text-muted-foreground">Health Score</p>
          </div>
        </div>
      </Card>

      {/* Health scores */}
      <Card className="glass p-6 animate-fade-in-up stagger-2">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /> Organ Health Scores</h3>
        <div className="space-y-3">
          {senseOrgans.map((organ) => (
            <div key={organ.id} className="flex items-center gap-4">
              <span className="text-sm font-medium w-20">{organ.name}</span>
              <Progress value={scores[organ.id] || 0} className="h-2 flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">{scores[organ.id] || 0}/100</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit form */}
      <Card className="glass p-6 animate-fade-in-up stagger-3">
        <h3 className="font-bold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Edit Profile</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (cannot change)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" value={user?.email || ''} disabled className="pl-10 opacity-60" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g., pollen, dust" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="conditions">Pre-existing Conditions</Label>
            <Input id="conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g., diabetes, hypertension" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="mt-6 gap-2">
          {saving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </Card>
    </div>
  );
}
