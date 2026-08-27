'use client';

import Link from 'next/link';
import { Eye, Ear, Wind, Utensils, Hand, ArrowRight } from 'lucide-react';
import { senseOrgans } from '@/lib/sense-data';
import { Card } from '@/components/ui/card';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Ear, Wind, Utensils, Hand,
};

export default function SenseOrgansPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sense Organs</h1>
        <p className="mt-1 text-muted-foreground">Explore detailed health modules for each of the five human sense organs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {senseOrgans.map((organ, i) => {
          const Icon = iconMap[organ.icon] || Eye;
          return (
            <Link key={organ.id} href={`/dashboard/sense-organs/${organ.id}`}>
              <Card className={`sense-card p-6 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold">{organ.name}</h3>
                <p className="text-sm text-primary font-medium mt-0.5">{organ.tagline}</p>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{organ.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Overview', 'Anatomy', 'Diseases', 'Assessment'].map((tag) => (
                    <span key={tag} className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
