'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Eye, Ear, Wind, Utensils, Hand, ArrowLeft, BookOpen, Activity, Stethoscope,
  AlertTriangle, FlaskConical, Pill, Shield, Home, Apple, Dumbbell, Lightbulb,
  HelpCircle, Scale, FileText, ExternalLink, Play, Phone, ClipboardCheck, Heart, Siren
} from 'lucide-react';
import { getOrgan } from '@/lib/sense-data';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Ear, Wind, Utensils, Hand,
};

export default function SenseOrganPage() {
  const params = useParams();
  const organId = params.id as string;
  const organ = getOrgan(organId);
  const [activeTab, setActiveTab] = useState('overview');

  if (!organ) return notFound();
  const Icon = iconMap[organ.icon] || Eye;
  const s = organ.sections;

  const sectionList = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'anatomy', label: 'Anatomy & Functions', icon: Activity },
    { id: 'diseases', label: 'Diseases & Symptoms', icon: Stethoscope },
    { id: 'diagnosis', label: 'Diagnosis & Tests', icon: FlaskConical },
    { id: 'treatment', label: 'Treatment & Prevention', icon: Pill },
    { id: 'lifestyle', label: 'Nutrition & Lifestyle', icon: Apple },
    { id: 'exercises', label: 'Exercises & Remedies', icon: Dumbbell },
    { id: 'faqs', label: 'FAQs & Myths', icon: HelpCircle },
    { id: 'research', label: 'Research & Resources', icon: FileText },
    { id: 'emergency', label: 'Emergency Care', icon: AlertTriangle },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'assessment', label: 'Self Assessment', icon: ClipboardCheck },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/sense-organs">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Hero */}
      <Card className="glass relative overflow-hidden p-8 animate-fade-in-up">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Icon className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{organ.name}</h1>
            <p className="text-lg text-primary font-medium mt-1">{organ.tagline}</p>
            <p className="mt-3 text-muted-foreground max-w-2xl">{organ.description}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex w-max gap-1">
            {sectionList.map((sec) => (
              <TabsTrigger key={sec.id} value={sec.id} className="gap-1.5">
                <sec.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{sec.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 animate-fade-in">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{s.overview}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/50 p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Key Functions</h3>
                <ul className="space-y-1.5">
                  {s.functions.slice(0, 4).map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/50 p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Common Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {s.diseases.slice(0, 5).map((d, i) => (
                    <Badge key={i} variant="secondary">{d.name}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Anatomy & Functions */}
        <TabsContent value="anatomy" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4">Anatomy</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.anatomy.map((item, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4">Functions</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.functions.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                    {i + 1}
                  </div>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Diseases & Symptoms */}
        <TabsContent value="diseases" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4">Common Diseases</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.diseases.map((d, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-4 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold text-sm mb-1">{d.name}</h3>
                  <p className="text-xs text-muted-foreground">{d.description}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Symptoms</h3>
              <ul className="space-y-2">
                {s.symptoms.map((sym, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-destructive">•</span> {sym}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="glass p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Causes</h3>
              <ul className="space-y-2">
                {s.causes.map((cause, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-warning">•</span> {cause}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <Card className="glass p-6">
            <h3 className="font-bold mb-3">Related Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {s.relatedConditions.map((c, i) => (
                <Badge key={i} variant="secondary">{c}</Badge>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Diagnosis & Tests */}
        <TabsContent value="diagnosis" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4">Diagnostic Methods</h2>
            <div className="space-y-3">
              {s.diagnosis.map((d, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 p-4">
                  <FlaskConical className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">{d}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4">Common Tests</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.tests.map((t, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-4">
                  <p className="text-sm font-medium">{t}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Treatment & Prevention */}
        <TabsContent value="treatment" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Pill className="h-5 w-5 text-primary" /> Treatment Options</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.treatment.map((t, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-4">
                  <p className="text-sm">{t}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Prevention</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.prevention.map((p, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 p-4">
                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">{p}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Nutrition & Lifestyle */}
        <TabsContent value="lifestyle" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Apple className="h-5 w-5 text-primary" /> Nutrition</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.nutrition.map((n, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-4">
                  <p className="text-sm">{n}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Lifestyle Tips</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.lifestyle.map((l, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 p-4">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">{l}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Exercises & Remedies */}
        <TabsContent value="exercises" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Dumbbell className="h-5 w-5 text-primary" /> Exercises</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.exercises.map((e, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                    {i + 1}
                  </div>
                  <p className="text-sm">{e}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> Home Remedies</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.homeRemedies.map((r, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-4">
                  <p className="text-sm">{r}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* FAQs & Myths */}
        <TabsContent value="faqs" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              {s.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Myth vs Fact</h2>
            <div className="space-y-3">
              {s.myths.map((m, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-2">
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-xs font-semibold text-destructive mb-1">MYTH</p>
                    <p className="text-sm">{m.myth}</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <p className="text-xs font-semibold text-primary mb-1">FACT</p>
                    <p className="text-sm">{m.fact}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Research & Resources */}
        <TabsContent value="research" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Latest Research</h2>
            <div className="space-y-3">
              {s.research.map((r, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-4">
                  <h3 className="font-semibold text-sm mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.summary}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4">Trusted Resources</h2>
            <div className="space-y-2">
              {s.trustedResources.map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:border-primary/30 transition-colors">
                  <span className="text-sm font-medium">{res.name}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Emergency Care */}
        <TabsContent value="emergency" className="mt-6 animate-fade-in space-y-4">
          <Card className="glass p-6 border-destructive/30">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Emergency Care</h2>
            <div className="space-y-3">
              {s.emergencyCare.map((e, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm">{e}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> When to Visit a Doctor</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {s.whenToVisit.map((w, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 p-4">
                  <span className="text-primary">•</span>
                  <p className="text-sm">{w}</p>
                </div>
              ))}
            </div>
          </Card>
          <Link href="/dashboard/emergency">
            <Button variant="outline" className="gap-2">
              <Siren className="h-4 w-4" /> View Full Emergency Guide
            </Button>
          </Link>
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="mt-6 animate-fade-in space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {s.videos.map((video, i) => (
              <Card key={i} className="glass overflow-hidden p-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium">{video.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Self Assessment */}
        <TabsContent value="assessment" className="mt-6 animate-fade-in">
          <Card className="glass p-8 text-center">
            <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Take {organ.name} Assessment</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete 10 specialized assessments to evaluate your {organ.name.toLowerCase()} health and get personalized recommendations.
            </p>
            <Link href={`/dashboard/assessment?organ=${organ.id}`}>
              <Button size="lg" className="gap-2">
                Start Assessment <ClipboardCheck className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
