CREATE TABLE weekly_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,            -- Monday of the reviewed week
  what_went_well TEXT DEFAULT '',
  what_to_improve TEXT DEFAULT '',
  next_week_intention TEXT DEFAULT '',
  week_rating INTEGER CHECK (week_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)          -- one review per week per user
);

ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reviews" ON weekly_reviews
  FOR ALL USING (auth.uid() = user_id);
