-- Enhanced Forum System with Images, Videos, and Replies

-- Update forum_posts to support media
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Forum post comments with replies (nested comments)
CREATE TABLE IF NOT EXISTS public.forum_post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.forum_post_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media JSONB DEFAULT '[]'::jsonb, -- Support images/videos in comments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment reactions (like forum_reactions but for comments)
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES public.forum_post_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion TEXT CHECK (emotion IN ('like', 'love', 'haha', 'wow', 'sad', 'angry')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id, emotion)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_forum_post_comments_post_id ON public.forum_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_comments_parent_id ON public.forum_post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_comments_user_id ON public.forum_post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON public.comment_reactions(comment_id);

-- Enable RLS
ALTER TABLE public.forum_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Comments are viewable by everyone" ON public.forum_post_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.forum_post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.forum_post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.forum_post_comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Reactions are viewable by everyone" ON public.comment_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add reactions" ON public.comment_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON public.comment_reactions FOR DELETE USING (auth.uid() = user_id);

-- Function to update comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts 
    SET comment_count = GREATEST(comment_count - 1, 0) 
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_count
AFTER INSERT OR DELETE ON public.forum_post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();
