'use client';

import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Bell, Trash2, Plus, Clock, Calendar, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { supabase, Reminder } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({ title: '', time: '09:00', frequency: 'daily' });
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setReminders(data as Reminder[]);
    })();
  }, [user]);

  const addReminder = async () => {
    if (!user || !newReminder.title.trim()) return;
    const { data } = await supabase
      .from('reminders')
      .insert({
        user_id: user.id,
        title: newReminder.title,
        time: newReminder.time,
        frequency: newReminder.frequency,
      })
      .select('*')
      .single();
    if (data) {
      setReminders((prev) => [data as Reminder, ...prev]);
      setNewReminder({ title: '', time: '09:00', frequency: 'daily' });
      toast({ title: 'Reminder added', description: 'Your health reminder has been created.' });
    }
  };

  const toggleReminder = async (id: string, active: boolean) => {
    await supabase.from('reminders').update({ active }).eq('id', id);
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, active } : r)));
  };

  const deleteReminder = async (id: string) => {
    await supabase.from('reminders').delete().eq('id', id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" /> Settings
        </h1>
        <p className="mt-1 text-muted-foreground">Manage your preferences and reminders</p>
      </div>

      {/* Appearance */}
      <Card className="glass p-6 animate-fade-in-up">
        <h3 className="font-bold mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
            </div>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="glass p-6 animate-fade-in-up stagger-2">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notifications</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Health Reminders</p>
            <p className="text-xs text-muted-foreground">Receive notifications for your reminders</p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
      </Card>

      {/* Reminders */}
      <Card className="glass p-6 animate-fade-in-up stagger-3">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Health Reminders</h3>

        {/* Add reminder */}
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] mb-4">
          <div className="space-y-1">
            <Label htmlFor="reminder-title" className="text-xs">Title</Label>
            <Input
              id="reminder-title"
              placeholder="e.g., Eye drops"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Time</Label>
            <Input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              className="w-28"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Frequency</Label>
            <Select value={newReminder.frequency} onValueChange={(v) => setNewReminder({ ...newReminder, frequency: v })}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={addReminder} size="icon" className="h-10 w-10">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Reminder list */}
        <div className="space-y-2">
          {reminders.length > 0 ? (
            reminders.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.time} • {r.frequency}</p>
                </div>
                <Switch checked={r.active} onCheckedChange={(v) => toggleReminder(r.id, v)} />
                <Button variant="ghost" size="icon" onClick={() => deleteReminder(r.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No reminders yet. Add one above.</p>
          )}
        </div>
      </Card>

      {/* Account */}
      <Card className="glass p-6 animate-fade-in-up stagger-4">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Account</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border/50 p-3">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="w-full gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
