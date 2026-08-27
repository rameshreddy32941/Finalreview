import { AssessmentResult } from './supabase';

export function normalizeAssessmentScore(a: Partial<AssessmentResult> | any): number {
  // If explicit percentage field exists
  if (typeof a.score_percentage === 'number') return clamp100(a.score_percentage);

  // If score already appears to be 0..100 use it directly
  if (typeof a.score === 'number' && a.score <= 100 && a.score >= 0) return Math.round(a.score);

  // If score/max_score present (e.g., 8/10)
  if (typeof a.score === 'number' && typeof a.max_score === 'number' && a.max_score > 0) {
    return clamp100(Math.round((a.score / a.max_score) * 100));
  }

  // If overall_score exists and looks like a percentage
  if (typeof a.overall_score === 'number' && a.overall_score >= 0 && a.overall_score <= 100) return Math.round(a.overall_score);

  // Fallback: try to coerce numeric score into 0-100 by heuristic
  if (typeof a.score === 'number') {
    // if small numbers like 0-10, assume out-of-10
    if (a.score <= 10) return clamp100(Math.round((a.score / 10) * 100));
    // otherwise, if larger than 100, cap
    return clamp100(Math.round(a.score));
  }

  return 0;
}

function clamp100(n: number) {
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeOverallFromLatestPerOrgan(latestScores: Record<string, number>) {
  const values = Object.values(latestScores).filter((v) => typeof v === 'number');
  if (values.length === 0) return { overall: 0, count: 0 };
  const sum = values.reduce((s, v) => s + v, 0);
  return { overall: Math.round(sum / values.length), count: values.length };
}

export function buildTrendData(records: Partial<AssessmentResult>[]) {
  return [...records]
    .filter((r) => Boolean(r.created_at))
    .sort((a, b) => new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime())
    .map((r) => ({
      date: new Date(r.created_at as string).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      score: normalizeAssessmentScore(r),
    }));
}
