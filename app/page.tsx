'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Ear, Wind, Utensils, Hand, Activity, Shield, Brain, ArrowRight, CheckCircle2, Heart, Globe2, Stethoscope, ClipboardCheck, Bot } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { senseOrgans } from '@/lib/sense-data';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Ear, Wind, Utensils, Hand,
};

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center medical-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative medical background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-chart-2/6 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-chart-4/5 blur-3xl animate-float-slow" />
        <div className="absolute top-20 left-1/2 h-72 w-72 rounded-full bg-chart-3/4 blur-3xl animate-float" />
      </div>

      {/* Nav */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Activity className="h-5 w-5" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight">HumanSenses</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#organs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sense Organs</a>
            <a href="#sdg" className="text-sm text-muted-foreground hover:text-foreground transition-colors">SDG 3</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gap-1 shadow-lg shadow-primary/30">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 overflow-hidden pt-32 pb-20 hero-gradient">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary animate-fade-in">
              <Heart className="h-3.5 w-3.5" />
              Aligned with UN SDG 3: Good Health & Well-being
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl animate-fade-in-up">
              Your Five Senses,
              <br />
              <span className="gradient-text animate-gradient-shift">Beautifully Cared For</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-in-up stagger-2">
              A premium healthcare platform dedicated to your eyes, ears, nose, tongue, and skin.
              Self-assessments, AI guidance, emergency care, and trusted resources — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-3">
              <Link href="/signup">
                <Button size="lg" className="gap-2 px-8 shadow-xl shadow-primary/30">
                  Start Your Health Journey <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating sense icons */}
        <div id="organs" className="relative z-10 mx-auto mt-20 max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {senseOrgans.map((organ, i) => {
              const Icon = iconMap[organ.icon] || Eye;
              return (
                <div
                  key={organ.id}
                  className={`group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-up stagger-${i + 1}`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{organ.name}</p>
                    <p className="text-xs text-muted-foreground">{organ.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">Everything you need for sensory health</h2>
            <p className="mt-4 text-muted-foreground">Comprehensive tools, assessments, and guidance for all five sense organs.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Bot, title: 'AI Health Assistant', desc: 'Educational chatbot with voice input for health guidance and precautions.' },
              { icon: ClipboardCheck, title: '50+ Self Assessments', desc: '10 assessments per sense organ with personalized results and recommendations.' },
              { icon: Shield, title: 'Emergency Guide', desc: 'First aid for eye injuries, nosebleeds, burns, chemical exposure, and more.' },
              { icon: Globe2, title: 'Nearby Hospitals', desc: 'Find eye hospitals, ENT, dermatologists, and dental care near you.' },
              { icon: CheckCircle2, title: 'Health Library', desc: 'Searchable articles, videos, infographics, and FAQs with bookmarks.' },
              { icon: Heart, title: 'Health Tracking', desc: 'Track your scores, trends, and assessment history over time.' },
            ].map((feature, i) => (
              <div key={i} className={`sense-card group p-6 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG */}
      <section id="sdg" className="relative z-10 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-12 backdrop-blur-xl text-center">
            <div className="pointer-events-none absolute inset-0 neural-bg opacity-50" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Globe2 className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold">Aligned with SDG 3</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                HumanSenses supports the United Nations Sustainable Development Goal 3:
                Ensure healthy lives and promote well-being for all at all ages. By providing
                accessible health education about the five sense organs, we empower individuals
                worldwide to take charge of their sensory health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-12 backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
            <div className="relative">
              <h2 className="text-4xl font-bold tracking-tight">Ready to take charge of your sensory health?</h2>
              <p className="mt-4 text-muted-foreground">Join HumanSenses today and get access to assessments, AI guidance, and trusted health resources.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 px-8 shadow-xl shadow-primary/30">
                    Create Free Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-semibold">HumanSenses</span>
          </div>
          <p className="text-sm text-muted-foreground">Educational platform. Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
