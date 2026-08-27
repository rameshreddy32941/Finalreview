import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key');

const missingConfigError = {
  data: null,
  error: {
    message:
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
  },
};

function createDbStub() {
  const stub: any = {
    select: async () => missingConfigError,
    maybeSingle: async () => missingConfigError,
    insert: async () => missingConfigError,
    delete: async () => missingConfigError,
    update: async () => missingConfigError,
    upsert: async () => missingConfigError,
    order: async () => missingConfigError,
    limit: async () => missingConfigError,
    eq: async () => missingConfigError,
    single: async () => missingConfigError,
    from: () => createDbStub(),
  };
  return stub;
}

function createAuthStub() {
  return {
    signInWithPassword: async () => missingConfigError,
    signUp: async () => missingConfigError,
    resetPasswordForEmail: async () => missingConfigError,
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
    signOut: async () => ({ data: null, error: null }),
  };
}

function createNotConfiguredClient() {
  return {
    auth: createAuthStub(),
    from: () => createDbStub(),
  };
}

export function isSupabaseTableMissingError(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return error.code === 'PGRST205' || /Could not find the table/i.test(error.message || '');
}

export function getSupabaseSchemaMissingMessage(error: { code?: string; message?: string } | null | undefined) {
  if (isSupabaseTableMissingError(error)) {
    return 'Supabase schema is not initialized. Run the migration SQL in supabase/migrations/20260714160147_create_humansenses_schema.sql or initialize the database schema in Supabase.';
  }
  return '';
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (createNotConfiguredClient() as any);

export function getAuthErrorMessage(error: { message?: string; code?: string } | null | undefined) {
  if (!error) return '';

  const normalizedMessage = (error.message || '').toLowerCase();

  if (
    error.code === 'over_email_send_rate_limit' ||
    normalizedMessage.includes('rate limit') ||
    normalizedMessage.includes('too many requests') ||
    normalizedMessage.includes('email rate limit')
  ) {
    return 'Too many email attempts. Please wait a few minutes before trying again.';
  }

  if (error.code === 'email_not_confirmed' || normalizedMessage.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.';
  }

  if (error.code === 'invalid_credentials' || normalizedMessage.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
  }

  return error.message || 'Authentication failed. Please try again.';
}

export type Profile = {
  id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  city: string | null;
  allergies: string | null;
  conditions: string | null;
  updated_at: string;
};

export type AssessmentResult = {
  id: string;
  user_id: string;
  organ: string;
  assessment_type: string;
  score: number;
  risk_level: string;
  overall_score: number | null;
  result_summary: string | null;
  suggestions: string[];
  remedies: string[];
  prevention: string[];
  nutrition: string[];
  exercises: string[];
  lifestyle: string[];
  warning_signs: string[];
  when_to_see_doctor: string | null;
  questions: string[];
  answers: string[];
  created_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  title: string;
  url: string | null;
  created_at: string;
};

export type Reminder = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  time: string | null;
  frequency: string;
  active: boolean;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type HealthScore = {
  id: string;
  user_id: string;
  eye: number;
  ear: number;
  nose: number;
  tongue: number;
  skin: number;
  overall: number;
  updated_at: string;
};
