'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Download, Eye, Ear, Wind, Utensils, Hand, Trash2, TrendingUp, ClipboardCheck, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase, AssessmentResult, isSupabaseTableMissingError, getSupabaseSchemaMissingMessage } from '@/lib/supabase';
import { senseOrgans } from '@/lib/sense-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

const organIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Ear, Wind, Utensils, Hand,
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [organFilter, setOrganFilter] = useState('all');
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Reports query error:', error);
        setDbError(
          isSupabaseTableMissingError(error)
            ? getSupabaseSchemaMissingMessage(error)
            : error.message || 'Unable to load reports.'
        );
        setReports([]);
      } else {
        setReports((data as AssessmentResult[]) || []);
      }
      setLoading(false);
    })();
  }, [user]);

  const filtered = organFilter === 'all' ? reports : reports.filter((r) => r.organ === organFilter);

  const trendData = [...reports].reverse().slice(-20).map((r) => ({
    date: new Date(r.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: r.score,
    organ: r.organ,
  }));

  const organAverages = senseOrgans.map((o) => {
    const organReports = reports.filter((r) => r.organ === o.id);
    const avg = organReports.length > 0
      ? Math.round(organReports.reduce((sum, r) => sum + r.score, 0) / organReports.length)
      : 0;
    return { name: o.name, score: avg, count: organReports.length };
  });

  const handleDownload = (report: AssessmentResult) => {
    const organ = senseOrgans.find((o) => o.id === report.organ);
    const content = `
HumanSenses — Assessment Report
================================

Date: ${new Date(report.created_at).toLocaleDateString()}
Organ: ${organ?.name || report.organ}
Assessment: ${report.assessment_type}

Score: ${report.score}/100
Overall Health Score: ${report.overall_score || 'N/A'}/100
Risk Level: ${report.risk_level}

Suggestions:
${(report.suggestions as string[]).map((s, i) => `${i + 1}. ${s}`).join('\n')}

Home Remedies:
${(report.remedies as string[]).map((r, i) => `${i + 1}. ${r}`).join('\n')}

Prevention:
${(report.prevention as string[]).map((p, i) => `${i + 1}. ${p}`).join('\n')}

---
Disclaimer: This report is for educational purposes only and is not a medical diagnosis.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HumanSenses-${report.organ}-${report.assessment_type.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('assessment_results').delete().eq('id', id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Reports</h1>
        <p className="mt-1 text-muted-foreground">View your assessment history and trends</p>
      </div>
      {dbError && (
        <Card className="glass p-6 border-destructive/30">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{dbError}</p>
          </div>
        </Card>
      )}

      {/* Charts */}
      {reports.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass p-6 animate-fade-in-up">
            <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Score Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="glass p-6 animate-fade-in-up stagger-2">
            <h3 className="font-bold mb-4 flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" /> Average Scores by Organ</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={organAverages}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setOrganFilter('all')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            organFilter === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All ({reports.length})
        </button>
        {senseOrgans.map((o) => {
          const count = reports.filter((r) => r.organ === o.id).length;
          return (
            <button
              key={o.id}
              onClick={() => setOrganFilter(o.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                organFilter === o.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {o.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Reports list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((report, i) => {
            const organ = senseOrgans.find((o) => o.id === report.organ);
            const Icon = organIcons[organ?.icon || 'Eye'] || Eye;
            return (
              <Card key={report.id} className="glass p-4 animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{report.assessment_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {organ?.name} • {new Date(report.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{report.score}</p>
                    <Badge variant={report.risk_level === 'Low' ? 'default' : report.risk_level === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">
                      {report.risk_level}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(report)} title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(report.id)} title="Delete" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No reports yet. Take an assessment to generate your first report.</p>
        </Card>
      )}
    </div>
  );
}
