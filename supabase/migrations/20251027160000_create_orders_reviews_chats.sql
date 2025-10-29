-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Product Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON product_reviews FOR SELECT TO public USING (true);
CREATE POLICY "Users can create reviews" ON product_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Seller chats (messages between buyer and seller for a product)
CREATE TABLE IF NOT EXISTS seller_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seller_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read chats" ON seller_chats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert chats" ON seller_chats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Minimal sellers table for product owners
CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sellers" ON sellers FOR SELECT TO public USING (true);

-- Link products to sellers (nullable)
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES sellers(id) ON DELETE SET NULL;
