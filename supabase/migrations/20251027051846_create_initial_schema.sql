/*
  # Create Echoes of Việt Nam Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `created_at` (timestamptz)
    
    - `forum_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `likes` (integer)
      - `created_at` (timestamptz)
    
    - `forum_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to forum_posts)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text)
      - `created_at` (timestamptz)
    
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamptz)
    
    - `user_profiles`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `display_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for public read access to products
    - Add policies for forum interactions
*/

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON forum_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Forum Comments Table
CREATE TABLE IF NOT EXISTS forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON forum_comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON forum_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON forum_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON forum_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
  ('Áp Phích Chiến Tranh Việt Nam', 'Bộ sưu tập áp phích tuyên truyền thời kỳ kháng chiến chống Mỹ', 250000, 'https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg', 'Áp Phích'),
  ('Sách Lịch Sử Việt Nam', 'Cuốn sách chi tiết về lịch sử đấu tranh giải phóng dân tộc', 150000, 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg', 'Sách'),
  ('Huy Hiệu Lịch Sử', 'Huy hiệu kỷ niệm các chiến dịch lịch sử', 50000, 'https://images.pexels.com/photos/33155/isolated-shirt-sport-white.jpg', 'Phụ Kiện'),
  ('Áo Thun Di Sản', 'Áo thun in hình biểu tượng văn hóa Việt Nam', 200000, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', 'Quần Áo'),
  ('Tranh Nghệ Thuật Cách Mạng', 'Tranh tái hiện những khoảnh khắc lịch sử hào hùng', 500000, 'https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg', 'Nghệ Thuật'),
  ('Bộ Tem Lịch Sử', 'Bộ sưu tập tem bưu chính thời kỳ kháng chiến', 100000, 'https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg', 'Phụ Kiện')
ON CONFLICT DO NOTHING;