-- Quiz System Tables

-- Quiz definitions table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- in seconds
  points_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank')) DEFAULT 'multiple_choice',
  options JSONB, -- Array of options for multiple choice
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  explanation TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers JSONB -- Store user's answers
);

-- User points/rewards table
CREATE TABLE IF NOT EXISTS public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- History viewing tracking
CREATE TABLE IF NOT EXISTS public.history_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'month', 'event', 'period'
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent INTEGER -- in seconds
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_history_views_user_id ON public.history_views(user_id);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Quizzes are viewable by everyone" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Quiz questions are viewable by everyone" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own points" ON public.user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own points" ON public.user_points FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own history" ON public.history_views FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON public.history_views FOR INSERT WITH CHECK (auth.uid() = user_id);
