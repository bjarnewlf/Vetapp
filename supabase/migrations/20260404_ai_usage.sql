-- Migration: AI Usage Rate Limiting
-- Tabelle zum Tracken von KI-Anfragen pro User (Rate Limiting)

CREATE TABLE IF NOT EXISTS ai_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index fuer schnelle Abfragen (user_id + created_at)
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_created ON ai_usage(user_id, created_at);

-- RLS aktivieren
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- User darf nur eigene Eintraege einfuegen
CREATE POLICY "Users can insert own usage"
  ON ai_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User darf nur eigene Eintraege lesen
CREATE POLICY "Users can read own usage"
  ON ai_usage
  FOR SELECT
  USING (auth.uid() = user_id);
