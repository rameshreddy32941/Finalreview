'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, Profile } from './supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then((response: { data: { session: Session | null } }) => {
      const session = response.data.session;
      if (!mounted) return;
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_: string, session: Session | null) => {
      setSession(session);
      if (session) {
        (async () => {
          await loadProfile(session.user.id);
        })();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    async function loadProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (mounted) {
          if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
            console.error('Profile load error:', error);
          }

          let nextProfile = (data as Profile | null) ?? null;

          // Email confirmation can delay the signup session, so create the
          // user's profile/score the first time they successfully sign in.
          if (!nextProfile && !error) {
            const metadata = (await supabase.auth.getUser()).data.user?.user_metadata || {};
            const profilePayload = {
              id: userId,
              full_name: metadata.full_name || 'HumanSenses User',
              age: metadata.age ? Number(metadata.age) : null,
              gender: metadata.gender || null,
              city: metadata.city || null,
              allergies: metadata.allergies || null,
              conditions: metadata.conditions || null,
            };
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .upsert(profilePayload, { onConflict: 'id' })
              .select('*')
              .maybeSingle();

            if (createError) {
              console.error('Profile creation error:', createError);
            } else {
              nextProfile = createdProfile as Profile | null;
            }

            const { data: existingScore } = await supabase
              .from('health_scores')
              .select('id')
              .eq('user_id', userId)
              .order('updated_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (!existingScore) {
              const { error: scoreError } = await supabase.from('health_scores').insert({
                user_id: userId,
                eye: 0,
                ear: 0,
                nose: 0,
                tongue: 0,
                skin: 0,
                overall: 0,
              });
              if (scoreError) console.error('Initial health score creation error:', scoreError);
            }
          }

          setProfile(nextProfile);
          setLoading(false);
        }
      } catch (err) {
        console.error('Profile load failed:', err);
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
      }
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (session) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
          console.error('Profile refresh error:', error);
        }
        setProfile((data as Profile | null) ?? null);
      } catch (err) {
        console.error('Profile refresh failed:', err);
        setProfile(null);
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
