/*
# HumanSenses — Core Schema

## Overview
Creates the persistent data layer for HumanSenses, a healthcare education platform
focused on the five human sense organs and SDG 3. This migration provisions all
tables needed for authentication-linked user data: profiles, assessment results,
bookmarks, reminders, and AI chat history.

## Tables

1. `profiles`
   - Extends Supabase `auth.users` with demographic + health metadata collected at signup.
   - Columns: id (FK auth.users), full_name, age, gender, city, allergies, conditions, updated_at.

2. `assessment_results`
   - Stores every self-assessment a user takes (10 per organ × 5 organs).
   - Columns: id, user_id, organ, assessment_type, score, risk_level, overall_score,
     suggestions (jsonb), remedies (jsonb), prevention (jsonb), nutrition (jsonb),
     exercises (jsonb), lifestyle (jsonb), warning_signs (jsonb), when_to_see_doctor (text),
     created_at.

3. `bookmarks`
   - Saved articles / videos / infographics from the Health Library.
   - Columns: id, user_id, item_type, item_id, title, url, created_at.

4. `reminders`
   - User-created health reminders (e.g. eye drops, hydration).
   - Columns: id, user_id, title, description, time, frequency, active, created_at.

5. `chat_history`
   - AI Health Assistant conversation log.
   - Columns: id, user_id, role (user/assistant), content, created_at.

6. `health_scores`
   - Aggregated per-organ and overall health score, updated after each assessment.
   - Columns: id, user_id, eye, ear, nose, tongue, skin, overall, updated_at.

## Security
- RLS enabled on every table.
- All tables are owner-scoped (`user_id` defaults to `auth.uid()`).
- Four CRUD policies per table scoped to `authenticated` users owning their rows.
- `profiles` is keyed by `id = auth.uid()` (1:1 with auth.users).

## Notes
1. All owner columns default to `auth.uid()` so frontend inserts omitting user_id succeed.
2. JSONB columns store structured arrays of personalized recommendations.
3. `updated_at` maintained via trigger for profiles and health_scores.
*/

-- ============ profiles ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  age integer,
  gender text,
  city text,
  allergies text,
  conditions text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============ assessment_results ============
CREATE TABLE IF NOT EXISTS assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  organ text NOT NULL,
  assessment_type text NOT NULL,
  score integer NOT NULL,
  risk_level text NOT NULL,
  overall_score integer,
  result_summary text,
  questions jsonb DEFAULT '[]'::jsonb,
  answers jsonb DEFAULT '[]'::jsonb,
  suggestions jsonb DEFAULT '[]'::jsonb,
  remedies jsonb DEFAULT '[]'::jsonb,
  prevention jsonb DEFAULT '[]'::jsonb,
  nutrition jsonb DEFAULT '[]'::jsonb,
  exercises jsonb DEFAULT '[]'::jsonb,
  lifestyle jsonb DEFAULT '[]'::jsonb,
  warning_signs jsonb DEFAULT '[]'::jsonb,
  when_to_see_doctor text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_assessments" ON assessment_results;
CREATE POLICY "select_own_assessments" ON assessment_results FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_assessments" ON assessment_results;
CREATE POLICY "insert_own_assessments" ON assessment_results FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_assessments" ON assessment_results;
CREATE POLICY "update_own_assessments" ON assessment_results FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_assessments" ON assessment_results;
CREATE POLICY "delete_own_assessments" ON assessment_results FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ bookmarks ============
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  title text NOT NULL,
  url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookmarks" ON bookmarks;
CREATE POLICY "select_own_bookmarks" ON bookmarks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookmarks" ON bookmarks;
CREATE POLICY "insert_own_bookmarks" ON bookmarks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookmarks" ON bookmarks;
CREATE POLICY "update_own_bookmarks" ON bookmarks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookmarks" ON bookmarks;
CREATE POLICY "delete_own_bookmarks" ON bookmarks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ library_items ============
CREATE TABLE IF NOT EXISTS library_items (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('article', 'video', 'infographic', 'faq')),
  title text NOT NULL,
  description text NOT NULL,
  organ text NOT NULL,
  category text NOT NULL,
  url text,
  video_id text,
  read_time text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_library_items" ON library_items;
CREATE POLICY "select_library_items" ON library_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_library_items" ON library_items;
-- Library content is application-managed. Authenticated users can read it,
-- but normal browser sessions cannot create, modify, or delete content.
DROP POLICY IF EXISTS "insert_library_items" ON library_items;
CREATE POLICY "insert_library_items" ON library_items FOR INSERT
  TO authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "update_library_items" ON library_items;
CREATE POLICY "update_library_items" ON library_items FOR UPDATE
  TO authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "delete_library_items" ON library_items;
CREATE POLICY "delete_library_items" ON library_items FOR DELETE
  TO authenticated USING (false);

-- ============ reminders ============
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  time text,
  frequency text DEFAULT 'daily',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reminders" ON reminders;
CREATE POLICY "select_own_reminders" ON reminders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reminders" ON reminders;
CREATE POLICY "insert_own_reminders" ON reminders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reminders" ON reminders;
CREATE POLICY "update_own_reminders" ON reminders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reminders" ON reminders;
CREATE POLICY "delete_own_reminders" ON reminders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ chat_history ============
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chats" ON chat_history;
CREATE POLICY "select_own_chats" ON chat_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_chats" ON chat_history;
CREATE POLICY "insert_own_chats" ON chat_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chats" ON chat_history;
CREATE POLICY "delete_own_chats" ON chat_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ health_scores ============
CREATE TABLE IF NOT EXISTS health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  eye integer DEFAULT 0,
  ear integer DEFAULT 0,
  nose integer DEFAULT 0,
  tongue integer DEFAULT 0,
  skin integer DEFAULT 0,
  overall integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_scores" ON health_scores;
CREATE POLICY "select_own_scores" ON health_scores FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_scores" ON health_scores;
CREATE POLICY "insert_own_scores" ON health_scores FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_scores" ON health_scores;
CREATE POLICY "update_own_scores" ON health_scores FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_scores" ON health_scores;
CREATE POLICY "delete_own_scores" ON health_scores FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ updated_at triggers ============
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS health_scores_updated_at ON health_scores;
CREATE TRIGGER health_scores_updated_at BEFORE UPDATE ON health_scores
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============ indexes ============
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_organ ON assessment_results(organ);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_user ON health_scores(user_id);