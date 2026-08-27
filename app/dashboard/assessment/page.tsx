'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Eye, Ear, Wind, Utensils, Hand, ClipboardCheck, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, Download, MapPin, Play, Lightbulb, Shield,
  Apple, Dumbbell, Heart, AlertTriangle, Activity, FileText
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase, AssessmentResult, isSupabaseTableMissingError, getSupabaseSchemaMissingMessage } from '@/lib/supabase';
import { senseOrgans } from '@/lib/sense-data';
import { assessments, getAssessmentsByOrgan, getAssessment, Assessment } from '@/lib/assessment-data';
import { generateResult, AssessmentResultData } from '@/lib/assessment-result';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const organIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Ear, Wind, Utensils, Hand,
};

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <AssessmentContent />
    </Suspense>
  );
}

function AssessmentContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const organFilter = searchParams.get('organ');

  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(organFilter);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerScores, setAnswerScores] = useState<number[]>([]);
  const [answerLabels, setAnswerLabels] = useState<string[]>([]);
  const [result, setResult] = useState<AssessmentResultData | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<AssessmentResult | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadHistory = async (currentUserId: string | null = user?.id ?? null) => {
    if (!currentUserId) {
      setAssessmentHistory([]);
      setHistoryLoading(false);
      return;
    }

    setHistoryLoading(true);

    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Load assessment history error:', error);
      setAssessmentHistory([]);
      const message = isSupabaseTableMissingError(error)
        ? getSupabaseSchemaMissingMessage(error)
        : 'Unable to load assessment history.';
      setLoadError(message);
      if (isSupabaseTableMissingError(error)) {
        setSaveError(message);
      }
    } else {
      setAssessmentHistory((data as AssessmentResult[]) || []);
    }

    setHistoryLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      loadHistory(user?.id ?? null);
    }
  }, [authLoading, user]);

  const handleStartAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setAnswerScores([]);
    setAnswerLabels([]);
    setResult(null);
    setSaved(false);
    setSelectedHistory(null);
    setSaveError(null);
    setSuccessMessage(null);
  };

  const handleOpenHistory = (historyItem: AssessmentResult) => {
    setSelectedHistory(historyItem);
    setSelectedAssessment(null);
    setSelectedOrgan(null);
    setResult(null);
    setAnswerScores([]);
    setAnswerLabels([]);
    setSaved(false);
    setSuccessMessage(null);
    setSaveError(null);
  };

  const handleCloseHistory = () => {
    setSelectedHistory(null);
  };

  const handleAnswer = (score: number, label: string) => {
    const newScores = [...answerScores, score];
    const newLabels = [...answerLabels, label];
    setAnswerScores(newScores);
    setAnswerLabels(newLabels);

    if (currentQuestion < selectedAssessment!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    const res = generateResult(selectedAssessment!, newScores);
    setResult(res);
    saveResult(res, newLabels);
  };

  const saveResult = async (res: AssessmentResultData, selectedAnswers: string[]) => {
    if (!selectedAssessment) return;

    setSaveLoading(true);
    setLoadError(null);
    setSaveError(null);
    setSuccessMessage(null);

    const questions = selectedAssessment.questions.map((question) => question.question);

    let authenticatedUser = user;
    if (!authenticatedUser) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Get current user error:', userError);
        setSaveError('Unable to identify the signed-in user. Please refresh and try again.');
        setSaveLoading(false);
        return;
      }
      authenticatedUser = userData?.user ?? null;
    }

    if (!authenticatedUser) {
      console.error('Assessment save skipped because no authenticated user was available.');
      setSaveError('Please sign in again before saving your assessment.');
      setSaveLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: authenticatedUser.id,
        organ: selectedAssessment.organ,
        assessment_type: selectedAssessment.title,
        score: res.score,
        risk_level: res.riskLevel,
        overall_score: res.overallScore,
        result_summary: res.summary,
        questions,
        answers: selectedAnswers,
        suggestions: res.suggestions,
        remedies: res.remedies,
        prevention: res.prevention,
        nutrition: res.nutrition,
        exercises: res.exercises,
        lifestyle: res.lifestyle,
        warning_signs: res.warningSigns,
        when_to_see_doctor: res.whenToSeeDoctor,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Save assessment error:', error);
      setSaveError(
        isSupabaseTableMissingError(error)
          ? getSupabaseSchemaMissingMessage(error)
          : 'Unable to save assessment result. Please try again later.'
      );
      setSaveLoading(false);
      return;
    }

    const savedResult = data as AssessmentResult;
    setAssessmentHistory((prev) => [savedResult, ...prev]);
    setSaved(true);
    setSuccessMessage('Assessment saved successfully. Your history has been updated.');
    await loadHistory(authenticatedUser.id);

    const { data: scoreData, error: scoreDataError } = await supabase
      .from('health_scores')
      .select('id, eye, ear, nose, tongue, skin')
      .eq('user_id', authenticatedUser.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (scoreDataError) {
      console.error('Load health_scores error:', scoreDataError);
    }

    const organKey = selectedAssessment.organ;
    const currentScores = {
      eye: (scoreData as any)?.eye ?? 0,
      ear: (scoreData as any)?.ear ?? 0,
      nose: (scoreData as any)?.nose ?? 0,
      tongue: (scoreData as any)?.tongue ?? 0,
      skin: (scoreData as any)?.skin ?? 0,
    };

    if (organKey in currentScores) {
      (currentScores as any)[organKey] = res.score;
    }

    const availableScores = Object.values(currentScores).filter((value) => typeof value === 'number' && value > 0) as number[];
    const overall = availableScores.length > 0
      ? Math.round(availableScores.reduce((sum, value) => sum + value, 0) / availableScores.length)
      : res.score;

    if (scoreData?.id) {
      const { error: updateError } = await supabase
        .from('health_scores')
        .update({ ...currentScores, overall })
        .eq('id', scoreData.id);

      if (updateError) {
        console.error('Update health_scores error:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('health_scores')
        .insert({
          user_id: authenticatedUser.id,
          ...currentScores,
          overall,
        });

      if (insertError) {
        console.error('Insert health_scores error:', insertError);
      }
    }

    setSaveLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!result || !selectedAssessment) return;
    const organ = senseOrgans.find((o) => o.id === selectedAssessment.organ);
    const content = `
HumanSenses — Health Assessment Report
=======================================

Date: ${new Date().toLocaleDateString()}
Organ: ${organ?.name || selectedAssessment.organ}
Assessment: ${selectedAssessment.title}

SCORES
------
Organ Score: ${result.score}/100
Overall Health Score: ${result.overallScore}/100
Risk Level: ${result.riskLevel}

PERSONALIZED SUGGESTIONS
-----------------------
${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

HOME REMEDIES
------------
${result.remedies.map((r, i) => `${i + 1}. ${r}`).join('\n')}

PREVENTION TIPS
--------------
${result.prevention.map((p, i) => `${i + 1}. ${p}`).join('\n')}

NUTRITION ADVICE
---------------
${result.nutrition.map((n, i) => `${i + 1}. ${n}`).join('\n')}

EXERCISES
---------
${result.exercises.map((e, i) => `${i + 1}. ${e}`).join('\n')}

LIFESTYLE IMPROVEMENTS
---------------------
${result.lifestyle.map((l, i) => `${i + 1}. ${l}`).join('\n')}

WARNING SIGNS
------------
${result.warningSigns.map((w, i) => `${i + 1}. ${w}`).join('\n')}

WHEN TO CONSULT A DOCTOR
-----------------------
${result.whenToSeeDoctor}

---
Disclaimer: This assessment is for educational purposes only and is not a medical diagnosis.
Always consult a qualified healthcare professional for medical advice.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HumanSenses-${selectedAssessment.organ}-${selectedAssessment.title.replace(/\s+/g, '-')}-Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSelectedAssessment(null);
    setResult(null);
    setAnswerScores([]);
    setAnswerLabels([]);
    setCurrentQuestion(0);
    setSaved(false);
    setSelectedHistory(null);
    setSaveError(null);
    setSuccessMessage(null);
  };

  // Assessment quiz view
  if (selectedAssessment && !result) {
    const question = selectedAssessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100;

    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Exit
          </Button>
          <Badge variant="secondary">
            Question {currentQuestion + 1} of {selectedAssessment.questions.length}
          </Badge>
        </div>

        <Progress value={progress} className="h-1.5" />

        <Card className="glass p-8 animate-scale-in">
          <div className="mb-6">
            <p className="text-sm text-primary font-medium mb-2">{selectedAssessment.title}</p>
            <h2 className="text-xl font-bold">{question.question}</h2>
          </div>
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option.score, option.text)}
                className="w-full rounded-xl border border-border/50 p-4 text-left text-sm transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
              >
                {option.text}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Result view
  if (result && selectedAssessment) {
    const organ = senseOrgans.find((o) => o.id === selectedAssessment.organ);
    const riskColor = result.riskLevel === 'Low' ? 'text-primary' : result.riskLevel === 'Medium' ? 'text-warning' : 'text-destructive';
    const riskBg = result.riskLevel === 'Low' ? 'bg-primary/10' : result.riskLevel === 'Medium' ? 'bg-warning/10' : 'bg-destructive/10';

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Assessments
          </Button>
          {saved && (
            <Badge className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> Saved
            </Badge>
          )}
        </div>

        {/* Score Card */}
        <Card className="glass p-8 animate-scale-in">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{selectedAssessment.title}</p>
            <div className="mt-4 flex items-center justify-center gap-8">
              <div>
                <div className={`text-5xl font-bold ${riskColor}`}>{result.score}</div>
                <p className="text-xs text-muted-foreground mt-1">Organ Score</p>
              </div>
              <div className="h-16 w-px bg-border" />
              <div>
                <div className="text-5xl font-bold">{result.overallScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Overall Health</p>
              </div>
              <div className="h-16 w-px bg-border" />
              <div className={`rounded-xl ${riskBg} px-4 py-2`}>
                <div className={`text-2xl font-bold ${riskColor}`}>{result.riskLevel}</div>
                <p className="text-xs text-muted-foreground mt-1">Risk Level</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommendations Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: Lightbulb, title: 'Personalized Suggestions', items: result.suggestions, color: 'text-primary' },
            { icon: Heart, title: 'Home Remedies', items: result.remedies, color: 'text-chart-2' },
            { icon: Shield, title: 'Prevention Tips', items: result.prevention, color: 'text-chart-3' },
            { icon: Apple, title: 'Nutrition Advice', items: result.nutrition, color: 'text-chart-4' },
            { icon: Dumbbell, title: 'Exercises', items: result.exercises, color: 'text-chart-5' },
            { icon: Activity, title: 'Lifestyle Improvements', items: result.lifestyle, color: 'text-primary' },
          ].map((section, i) => (
            <Card key={i} className="glass p-6 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <section.icon className={`h-4 w-4 ${section.color}`} /> {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex gap-2">
                    <span className={section.color}>•</span> {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Warning Signs */}
        <Card className="glass p-6 border-destructive/30 animate-fade-in">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Warning Signs
          </h3>
          <div className="grid gap-2 md:grid-cols-2">
            {result.warningSigns.map((w, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm">{w}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* When to see doctor */}
        <Card className="glass p-6 animate-fade-in">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> When to Consult a Doctor
          </h3>
          <p className="text-sm text-muted-foreground">{result.whenToSeeDoctor}</p>
        </Card>

        {/* Related videos + hospitals */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Play className="h-4 w-4 text-primary" /> Related Videos</h3>
            <div className="space-y-3">
              {organ?.sections.videos.slice(0, 2).map((v, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                  <div className="aspect-video w-20 rounded bg-black overflow-hidden">
                    <iframe src={`https://www.youtube.com/embed/${v.videoId}`} title={v.title} className="h-full w-full pointer-events-none" />
                  </div>
                  <p className="text-sm font-medium flex-1">{v.title}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Find Specialists</h3>
            <p className="text-sm text-muted-foreground mb-4">Find nearby {organ?.name} specialists and hospitals.</p>
            <Link href={`/dashboard/hospitals?type=${selectedAssessment.organ}`}>
              <Button variant="outline" className="w-full gap-2">
                <MapPin className="h-4 w-4" /> Find Nearby Hospitals
              </Button>
            </Link>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleDownloadPDF} className="gap-2 flex-1">
            <Download className="h-4 w-4" /> Download Report
          </Button>
          <Link href="/dashboard/reports" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <FileText className="h-4 w-4" /> View All Reports
            </Button>
          </Link>
          <Button variant="secondary" onClick={reset} className="gap-2 flex-1">
            <ClipboardCheck className="h-4 w-4" /> Take Another
          </Button>
        </div>
      </div>
    );
  }

  // History detail view
  if (selectedHistory) {
    const organ = senseOrgans.find((o) => o.id === selectedHistory.organ);
    const riskColor = selectedHistory.risk_level === 'Low' ? 'text-primary' : selectedHistory.risk_level === 'Medium' ? 'text-warning' : 'text-destructive';
    const riskBg = selectedHistory.risk_level === 'Low' ? 'bg-primary/10' : selectedHistory.risk_level === 'Medium' ? 'bg-warning/10' : 'bg-destructive/10';

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessment Details</h1>
            <p className="mt-1 text-muted-foreground">Review your saved self-assessment result in full.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCloseHistory}>Back</Button>
            <Button onClick={() => {
              const downloadReport = async () => {
                const content = `HumanSenses — Assessment Report\n\nDate: ${new Date(selectedHistory.created_at).toLocaleDateString()}\nOrgan: ${organ?.name || selectedHistory.organ}\nAssessment: ${selectedHistory.assessment_type}\n\nScore: ${selectedHistory.score}/100\nOverall Health Score: ${selectedHistory.overall_score || 'N/A'}/100\nRisk Level: ${selectedHistory.risk_level}\n\nSummary:\n${selectedHistory.result_summary || 'N/A'}\n\nSuggestions:\n${(selectedHistory.suggestions as string[]).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWarning Signs:\n${(selectedHistory.warning_signs as string[]).map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\nWhen to consult a doctor:\n${selectedHistory.when_to_see_doctor || 'N/A'}\n\nDisclaimer: This report is for educational purposes only and is not a medical diagnosis.\n`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `HumanSenses-${selectedHistory.organ}-${selectedHistory.assessment_type.replace(/\s+/g, '-')}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              };
              downloadReport();
            }}>Download</Button>
          </div>
        </div>

        <Card className="glass p-8">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="text-sm text-muted-foreground">{selectedHistory.assessment_type}</p>
              <h2 className="text-3xl font-bold mt-2">{organ?.name || selectedHistory.organ}</h2>
              <p className="text-sm text-muted-foreground mt-2">{new Date(selectedHistory.created_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="rounded-3xl px-6 py-4 border border-border/50 bg-background">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Score</p>
                  <p className="text-3xl font-bold">{selectedHistory.score}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Risk level</p>
                  <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${riskColor} ${riskBg}`}>{selectedHistory.risk_level}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass p-6">
            <h3 className="font-bold mb-3">Summary</h3>
            <p className="text-sm text-muted-foreground">{selectedHistory.result_summary || 'No summary available.'}</p>
          </Card>
          <Card className="glass p-6">
            <h3 className="font-bold mb-3">Questions & Answers</h3>
            <div className="space-y-3">
              {(selectedHistory.questions as string[]).map((question, index) => (
                <div key={index} className="rounded-xl border border-border/50 bg-background p-3">
                  <p className="text-sm font-semibold">{question}</p>
                  <p className="text-sm text-muted-foreground mt-1">Answer: {(selectedHistory.answers as string[])[index] || 'N/A'}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'Suggestions', items: selectedHistory.suggestions as string[] },
            { title: 'Remedies', items: selectedHistory.remedies as string[] },
            { title: 'Prevention', items: selectedHistory.prevention as string[] },
            { title: 'Nutrition', items: selectedHistory.nutrition as string[] },
            { title: 'Exercises', items: selectedHistory.exercises as string[] },
            { title: 'Lifestyle', items: selectedHistory.lifestyle as string[] },
          ].map((section) => (
            <Card key={section.title} className="glass p-6">
              <h3 className="font-bold mb-3">{section.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.items.length > 0 ? section.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                )) : <li>No information available.</li>}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="glass p-6">
          <h3 className="font-bold mb-3">Warning Signs</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {(selectedHistory.warning_signs as string[]).map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </Card>

        <Card className="glass p-6">
          <h3 className="font-bold mb-3">When to Consult a Doctor</h3>
          <p className="text-sm text-muted-foreground">{selectedHistory.when_to_see_doctor || 'No guidance available.'}</p>
        </Card>
      </div>
    );
  }

  // Organ selection view
  if (!selectedOrgan) {
    return (
      <div className="space-y-6 animate-fade-in">
        {loadError && (
          <Card className="glass p-6 border-destructive/30">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{loadError}</p>
            </div>
          </Card>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Self Assessment Center</h1>
          <p className="mt-1 text-muted-foreground">Choose a sense organ to start your assessment</p>
        </div>
        <div className="space-y-6">
          <Card className="glass p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Assessment History</h2>
                <p className="text-sm text-muted-foreground">Review your latest saved self-assessments.</p>
              </div>
              {historyLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Loading...
                </div>
              )}
            </div>

            {assessmentHistory.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No assessment history yet. Complete a self-assessment to save your first result.</p>
            ) : (
              <div className="space-y-3 mt-4">
                {assessmentHistory.slice(0, 4).map((history) => (
                  <Card key={history.id} className="glass p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{history.assessment_type}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(history.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{history.score}</p>
                        <Badge variant={history.risk_level === 'Low' ? 'default' : history.risk_level === 'Medium' ? 'secondary' : 'destructive'} className="text-xs mt-1">
                          {history.risk_level}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenHistory(history)}>
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {senseOrgans.map((organ, i) => {
            const Icon = organIcons[organ.icon] || Eye;
            const count = getAssessmentsByOrgan(organ.id).length;
            return (
              <button key={organ.id} onClick={() => setSelectedOrgan(organ.id)} className="text-left">
                <Card className={`sense-card p-6 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{organ.name}</h3>
                      <p className="text-xs text-muted-foreground">{count} assessments available</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{organ.tagline}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium">
                    Start Assessment <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Assessment list view
  const organ = senseOrgans.find((o) => o.id === selectedOrgan);
  const organAssessments = getAssessmentsByOrgan(selectedOrgan);
  const Icon = organIcons[organ?.icon || 'Eye'] || Eye;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedOrgan(null)} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> All Organs
          </Button>
        </div>
      </div>

      <Card className="glass p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{organ?.name} Assessments</h1>
            <p className="text-sm text-muted-foreground">{organAssessments.length} assessments available</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {organAssessments.map((assessment, i) => (
          <Card key={assessment.id} className="glass p-6 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <Badge variant="secondary">{assessment.questions.length} questions</Badge>
            </div>
            <h3 className="font-bold mb-1">{assessment.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{assessment.description}</p>
            <Button onClick={() => handleStartAssessment(assessment)} className="w-full gap-2">
              Start <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
