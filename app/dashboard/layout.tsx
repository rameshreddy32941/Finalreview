'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Activity, LayoutDashboard, Eye, Ear, Wind, Utensils, Hand, ClipboardCheck,
  Bot, BookOpen, Siren, MapPin, FileText, User, Settings, Moon, Sun,
  LogOut, Menu, X, ChevronRight, Heart, Camera, Globe2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { senseOrgans } from '@/lib/sense-data';
import { MedicalDisclaimer } from '@/components/medical-disclaimer';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Sense Organs', href: '/dashboard/sense-organs', icon: Eye, expandable: true },
  { label: 'Self Assessment', href: '/dashboard/assessment', icon: ClipboardCheck },
  { label: 'AI Health Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  { label: 'AI Camera Scan', href: '/dashboard/camera-scan', icon: Camera },
  { label: 'Health Library', href: '/dashboard/library', icon: BookOpen },
  { label: 'Emergency Guide', href: '/dashboard/emergency', icon: Siren },
  { label: 'Nearby Hospitals', href: '/dashboard/hospitals', icon: MapPin },
  { label: 'Saved Reports', href: '/dashboard/reports', icon: FileText },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const organIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Ear, Wind, Utensils, Hand,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [organsExpanded, setOrgansExpanded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (pathname?.includes('/dashboard/sense-organs/') || pathname?.includes('/dashboard/library/')) {
      setOrgansExpanded(true);
    }
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center medical-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Activity className="h-8 w-8" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading HumanSenses...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center medical-bg">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="relative min-h-screen bg-background medical-bg overflow-hidden">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-chart-2/5 blur-3xl animate-float" />
        <div className="absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-chart-4/5 blur-3xl animate-float-slow" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border/50 bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
            <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Activity className="h-5 w-5" />
                <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
              </div>
              <span className="text-lg font-bold tracking-tight">HumanSenses</span>
            </Link>
            <button className="lg:hidden rounded-lg p-1 hover:bg-secondary" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <div key={item.href}>
                  {item.expandable ? (
                    <>
                      <button
                        onClick={() => setOrgansExpanded(!organsExpanded)}
                        className={`w-full ${active ? 'nav-link nav-link-active' : 'nav-link'} justify-between`}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${organsExpanded ? 'rotate-90' : ''}`} />
                      </button>
                      {organsExpanded && (
                        <div className="ml-6 mt-1 space-y-1 animate-fade-in">
                          {senseOrgans.map((organ) => {
                            const Icon = organIcons[organ.icon] || Eye;
                            const organActive = pathname === `/dashboard/sense-organs/${organ.id}`;
                            return (
                              <Link
                                key={organ.id}
                                href={`/dashboard/sense-organs/${organ.id}`}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                                  organActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {organ.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={active ? 'nav-link nav-link-active' : 'nav-link'}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm ring-2 ring-primary/20">
                {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{profile?.full_name || 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={signOut}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="relative z-10 lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-8">
          <button className="lg:hidden rounded-lg p-2 hover:bg-secondary" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-primary" />
            <span>Your sensory health companion</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8">
          {children}
          <MedicalDisclaimer />
        </main>
      </div>
    </div>
  );
}
