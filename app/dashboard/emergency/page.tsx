'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Siren, Eye, Ear, Wind, Hand, Flame, Droplet, AlertTriangle, Phone, MapPin,
  CheckCircle2, XCircle, ArrowRight, Shield
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Emergency = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  do: string[];
  dont: string[];
  hospitalType: string;
};

const emergencies: Emergency[] = [
  {
    id: 'eye-injury',
    title: 'Eye Injury',
    icon: Eye,
    color: 'text-primary',
    description: 'Physical trauma or foreign object in the eye.',
    do: [
      'Gently flush the eye with clean water for 15+ minutes if chemical exposure',
      'Cover the eye with a sterile shield or cup',
      'Seek emergency medical care immediately',
      'Keep the injured person calm and still',
    ],
    dont: [
      'Do NOT rub or press the eye',
      'Do NOT remove an embedded object',
      'Do NOT apply ointment or medication',
      'Do NOT attempt to remove a foreign object yourself',
    ],
    hospitalType: 'eye',
  },
  {
    id: 'nosebleed',
    title: 'Nosebleed (Epistaxis)',
    icon: Wind,
    color: 'text-chart-3',
    description: 'Bleeding from the nose, often from dry air or trauma.',
    do: [
      'Sit upright and lean forward slightly',
      'Pinch the soft part of your nose for 10-15 minutes',
      'Apply an ice pack to the bridge of your nose',
      'Breathe through your mouth',
    ],
    dont: [
      'Do NOT tilt your head back (blood can go down your throat)',
      'Do NOT blow your nose for several hours',
      'Do NOT pack the nose with tissue',
      'Do NOT lie flat',
    ],
    hospitalType: 'general',
  },
  {
    id: 'burns',
    title: 'Skin Burns',
    icon: Flame,
    color: 'text-destructive',
    description: 'Thermal, chemical, or electrical burns to the skin.',
    do: [
      'Cool the burn with running water for 20 minutes',
      'Remove jewelry and tight clothing near the burn',
      'Cover with a clean, non-stick dressing',
      'Seek medical care for large or deep burns',
    ],
    dont: [
      'Do NOT apply ice, butter, or toothpaste',
      'Do NOT break blisters',
      'Do NOT remove stuck clothing from the burn',
      'Do NOT apply adhesive bandages directly',
    ],
    hospitalType: 'general',
  },
  {
    id: 'allergic-reaction',
    title: 'Severe Allergic Reaction',
    icon: AlertTriangle,
    color: 'text-warning',
    description: 'Anaphylaxis or severe allergic response.',
    do: [
      'Call emergency services immediately',
      'Use an EpiPen if available',
      'Keep the person lying down with legs elevated',
      'Loosen tight clothing',
    ],
    dont: [
      'Do NOT give oral medication if the person is struggling to breathe',
      'Do NOT assume symptoms will pass',
      'Do NOT leave the person alone',
      'Do NOT delay calling for emergency help',
    ],
    hospitalType: 'general',
  },
  {
    id: 'ear-injury',
    title: 'Ear Injury',
    icon: Ear,
    color: 'text-chart-2',
    description: 'Trauma, foreign object, or sudden hearing loss.',
    do: [
      'Apply a clean dressing if there is external bleeding',
      'Keep the head elevated',
      'Seek medical evaluation for sudden hearing loss within 72 hours',
      'Protect the ear from further injury',
    ],
    dont: [
      'Do NOT insert anything into the ear canal',
      'Do NOT try to remove a deeply embedded object',
      'Do NOT apply pressure if fluid is leaking',
      'Do NOT use ear drops without medical advice',
    ],
    hospitalType: 'ear',
  },
  {
    id: 'chemical-exposure',
    title: 'Chemical Exposure',
    icon: Droplet,
    color: 'text-destructive',
    description: 'Skin or eye contact with harmful chemicals.',
    do: [
      'Immediately flush the affected area with copious water for 15+ minutes',
      'Remove contaminated clothing',
      'Identify the chemical if possible for medical staff',
      'Call poison control or emergency services',
    ],
    dont: [
      'Do NOT apply neutralizing chemicals',
      'Do NOT rub the affected area',
      'Do NOT delay flushing to find the chemical source',
      'Do NOT re-contaminate by putting clothes back on',
    ],
    hospitalType: 'general',
  },
];

export default function EmergencyPage() {
  const [selected, setSelected] = useState<Emergency | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Siren className="h-8 w-8 text-destructive" /> Emergency Guide
        </h1>
        <p className="mt-1 text-muted-foreground">First aid for sense organ emergencies</p>
      </div>

      {/* Emergency banner */}
      <Card className="glass p-4 border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium">In a life-threatening emergency, call your local emergency number immediately.</p>
        </div>
      </Card>

      {/* Emergency cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {emergencies.map((em, i) => (
          <Card
            key={em.id}
            className="glass p-6 card-hover cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
            onClick={() => setSelected(em)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary ${em.color}`}>
                <em.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold">{em.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{em.description}</p>
            <div className="flex items-center gap-1 text-sm text-primary font-medium">
              View First Aid <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <Card className="glass-strong p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary ${selected.color}`}>
                  <selected.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selected.title}</h2>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" /> DO
                  </h3>
                  <ul className="space-y-2">
                    {selected.do.map((d, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" /> DON'T
                  </h3>
                  <ul className="space-y-2">
                    {selected.dont.map((d, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl border border-border/50 p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">Need professional care?</span>
                </div>
                <Link href={`/dashboard/hospitals?type=${selected.hospitalType}`}>
                  <Button size="sm" className="gap-1">
                    <MapPin className="h-4 w-4" /> Find Hospital
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
