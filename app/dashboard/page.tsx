'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity, Eye, Ear, Wind, Utensils, Hand, ClipboardCheck, Bot, BookOpen,
  Siren, MapPin, TrendingUp, Calendar, Lightbulb, ArrowRight, Heart, Camera
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase, AssessmentResult, HealthScore, isSupabaseTableMissingError, getSupabaseSchemaMissingMessage } from '@/lib/supabase';
import { normalizeAssessmentScore, buildTrendData } from '@/lib/assessment-utils';
import { getDailyTip } from '@/lib/library-data';
import { senseOrgans } from '@/lib/sense-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line,
} from 'recharts';

const organIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Ear, Wind, Utensils, Hand,
};

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const [scores, setScores] = useState<HealthScore | null>(null);
  const [assessmentRecords, setAssessmentRecords] = useState<AssessmentResult[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<AssessmentResult[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<{ date: string; score: number }[]>([]);
  const [overallCount, setOverallCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const dailyTip = getDailyTip();

  useEffect(() => {
    if (!user) return;
    (async () => {
      setDbError(null);
      try {
        const [scoreRes, assessmentsRes] = await Promise.all([
          supabase.from('health_scores').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('assessment_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        ]);

        if ((scoreRes as any).error) {
          console.error('health_scores query error:', (scoreRes as any).error);
          setDbError(
            isSupabaseTableMissingError((scoreRes as any).error)
              ? getSupabaseSchemaMissingMessage((scoreRes as any).error)
              : ((scoreRes as any).error.message || 'Error loading health scores')
          );
        }
        if ((assessmentsRes as any).error) {
          console.error('assessment_results query error:', (assessmentsRes as any).error);
          setDbError(
            isSupabaseTableMissingError((assessmentsRes as any).error)
              ? getSupabaseSchemaMissingMessage((assessmentsRes as any).error)
              : ((assessmentsRes as any).error.message || 'Error loading assessments')
          );
        }

        const fetchedScores = (scoreRes as any).data as HealthScore | null;
        const fetchedAssessments = ((assessmentsRes as any).data as AssessmentResult[]) || [];

        console.debug('Fetched assessments count:', fetchedAssessments.length);
        console.debug('Raw assessment samples:', fetchedAssessments.slice(0, 3));

        setScores(fetchedScores);
        setRecentAssessments(fetchedAssessments);

        const allRes = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(200);

        if ((allRes as any).error) {
          console.error('all assessments query error:', (allRes as any).error);
          setDbError(
            isSupabaseTableMissingError((allRes as any).error)
              ? getSupabaseSchemaMissingMessage((allRes as any).error)
              : ((allRes as any).error.message || 'Error loading assessment trend')
          );
        } else if ((allRes as any).data && (allRes as any).data.length > 0) {
          const records = (allRes as any).data as AssessmentResult[];
          const normalized = records.map((r) => normalizeAssessmentScore(r));
          console.debug('Normalized scores:', normalized.slice(0, 10));

          setAssessmentRecords(records);
          setTrendData(buildTrendData(records));
          setOverallCount(records.length);

          if (!fetchedScores) {
            const latestPerOrgan: Record<string, number> = {};
            records
              .slice()
              .reverse()
              .forEach((record) => {
                if (!latestPerOrgan[record.organ]) latestPerOrgan[record.organ] = normalizeAssessmentScore(record);
              });

            setScores({
              id: 'synthetic',
              user_id: user.id,
              eye: latestPerOrgan.eye || 0,
              ear: latestPerOrgan.ear || 0,
              nose: latestPerOrgan.nose || 0,
              tongue: latestPerOrgan.tongue || 0,
              skin: latestPerOrgan.skin || 0,
              overall: Math.round(records.reduce((sum, record) => sum + normalizeAssessmentScore(record), 0) / records.length),
              updated_at: new Date().toISOString(),
            } as HealthScore);
          }
        } else {
          setAssessmentRecords([]);
          setTrendData([]);
          setOverallCount(0);
        }
      } catch (err) {
        console.error('Dashboard data load error:', err);
        setDbError('Unable to load dashboard data. See console for details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const organScoreMap = senseOrgans.reduce((acc, organ) => {
    acc[organ.id] = 0;
    return acc;
  }, {} as Record<string, number>);

  const seenOrgans = new Set<string>();
  [...assessmentRecords]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .forEach((record) => {
      // Keep only the newest assessment for each sense organ.
      if (!seenOrgans.has(record.organ)) {
        organScoreMap[record.organ] = normalizeAssessmentScore(record);
        seenOrgans.add(record.organ);
      }
    });

  const radarData = senseOrgans.map((o) => ({
    organ: o.name,
    score: organScoreMap[o.id] || 0,
  }));

  const barData = senseOrgans.map((o) => ({
    name: o.name,
    score: organScoreMap[o.id] || 0,
  }));

  const scoredOrgans = senseOrgans
    .map((organ) => organScoreMap[organ.id] || 0)
    .filter((score) => score > 0);
  const hasAssessments = scoredOrgans.length > 0;
  const overallScore = hasAssessments
    ? Math.round(scoredOrgans.reduce((sum, score) => sum + score, 0) / scoredOrgans.length)
    : 0;

  const quickActions = [
    { label: 'Self Assessment', href: '/dashboard/assessment', icon: ClipboardCheck, color: 'text-primary' },
    { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Bot, color: 'text-chart-2' },
    { label: 'AI Camera Scan', href: '/dashboard/camera-scan', icon: Camera, color: 'text-emerald-500' },
    { label: 'Health Library', href: '/dashboard/library', icon: BookOpen, color: 'text-chart-3' },
    { label: 'Emergency', href: '/dashboard/emergency', icon: Siren, color: 'text-destructive' },
    { label: 'Hospitals', href: '/dashboard/hospitals', icon: MapPin, color: 'text-chart-4' },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {dbError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {dbError}
        </div>
      ) : null}
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-1 text-muted-foreground">Here is your sensory health overview</p>
      </div>

      {/* Top row: Health Score + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health Score */}
        <Card className="glass p-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Health Score</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-bold">{hasAssessments ? overallScore : '—'}</span>
                {hasAssessments && <span className="mb-1 text-sm text-muted-foreground">/ 100</span>}
              </div>
            </div>
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                {hasAssessments && <circle
                  cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                  strokeDasharray={`${(overallScore / 100) * 213.6} 213.6`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />}
              </svg>
              <Heart className="absolute h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={hasAssessments ? overallScore : 0} className="h-2" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {hasAssessments
              ? overallScore >= 70
                ? 'Your latest sense-organ results look good. Keep maintaining healthy habits.'
                : overallScore >= 40
                  ? 'Some areas may benefit from attention. Review your latest assessment recommendations.'
                  : 'Your results suggest that you should review the recommendations and consider professional advice.'
              : 'Complete your first assessment to generate a personalized score.'}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{overallCount > 0 ? `Based on ${overallCount} completed assessment${overallCount > 1 ? 's' : ''}` : 'No completed assessments yet'}</p>
          {!hasAssessments && (
            <Button asChild size="sm" className="mt-4 w-full gap-2">
              <Link href="/dashboard/assessment">Start your first assessment <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="glass p-6 lg:col-span-2 animate-fade-in-up stagger-2">
          <p className="text-sm font-medium mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="group flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary ${action.color} transition-transform group-hover:scale-110`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card className="glass p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">Organ Health Breakdown</p>
              <p className="text-xs text-muted-foreground">Score per sense organ</p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="organ" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card className="glass p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">Score Comparison</p>
              <p className="text-xs text-muted-foreground">Across all five senses</p>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trend + Daily Tip */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend */}
        <Card className="glass p-6 lg:col-span-2 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">Assessment Score Trend</p>
              <p className="text-xs text-muted-foreground">Your progress over time</p>
            </div>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 opacity-50" />
                Take assessments to see your trend
              </div>
            </div>
          )}
        </Card>

        {/* Daily Tip */}
        <Card className="glass p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lightbulb className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium">Daily Health Tip</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{dailyTip}</p>
          <Link href="/dashboard/assessment">
            <Button variant="outline" size="sm" className="mt-4 w-full gap-1">
              Take an assessment <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Assessments + Sense Organs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Assessments */}
        <Card className="glass p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Recent Assessments</p>
            <Link href="/dashboard/reports" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentAssessments.length > 0 ? (
            <div className="space-y-3">
              {recentAssessments.map((a) => {
                const Icon = organIcons[senseOrgans.find((o) => o.id === a.organ)?.icon || 'Eye'] || Eye;
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.assessment_type}</p>
                      <p className="text-xs text-muted-foreground capitalize">{a.organ}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{a.score}/100</p>
                      <Badge variant={a.risk_level === 'Low' ? 'default' : a.risk_level === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">
                        {a.risk_level}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
              <div className="text-center">
                <ClipboardCheck className="mx-auto mb-2 h-8 w-8 opacity-50" />
                No assessments yet
              </div>
            </div>
          )}
        </Card>

        {/* Sense Organs Grid */}
        <Card className="glass p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Sense Organs</p>
            <Link href="/dashboard/sense-organs" className="text-xs text-primary hover:underline">Explore all</Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {senseOrgans.map((organ) => {
              const Icon = organIcons[organ.icon] || Eye;
              const score = organScoreMap[organ.id] || 0;
              return (
                <Link key={organ.id} href={`/dashboard/sense-organs/${organ.id}`}>
                  <div className="group flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-all hover:border-primary/40 hover:bg-secondary/50">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{organ.name}</p>
                      <p className="text-xs text-muted-foreground">{organ.tagline}</p>
                    </div>
                    <div className="w-20">
                      <Progress value={score} className="h-1.5" />
                      <span className="text-xs text-muted-foreground mt-1 block">{score}/100</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
