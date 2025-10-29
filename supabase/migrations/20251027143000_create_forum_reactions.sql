-- Forum Reactions Table
CREATE TABLE IF NOT EXISTS forum_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emotion text NOT NULL CHECK (emotion IN ('like', 'proud', 'haha', 'love')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
  ON forum_reactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can react"
  ON forum_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reactions"
  ON forum_reactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON forum_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
