-- Shop System: User → Shop Owner Upgrade

-- Shop packages enum
CREATE TYPE shop_package_type AS ENUM ('BASIC', 'PRO');

-- Shop requests table
CREATE TABLE IF NOT EXISTS public.shop_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  package_type shop_package_type NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'verified', 'refunded')) DEFAULT 'pending',
  payment_proof_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Shops table
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  package_type shop_package_type NOT NULL,
  revenue DECIMAL(12,2) DEFAULT 0,
  revenue_limit DECIMAL(12,2) NOT NULL,
  first_shipping_support_percent INTEGER DEFAULT 0,
  second_shipping_support_percent INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  deposit_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop products (enhanced from existing products table)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES public.shops(id);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Shop orders (link existing orders to shops)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES public.shops(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_support_amount DECIMAL(10,2) DEFAULT 0;

-- Shop revenue transactions
CREATE TABLE IF NOT EXISTS public.shop_revenue_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('sale', 'refund', 'withdrawal', 'shipping_support')) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin actions log
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL, -- 'approve_shop', 'ban_user', 'refund_payment', etc.
  target_type TEXT NOT NULL, -- 'shop_request', 'user', 'payment', etc.
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shop_requests_user_id ON public.shop_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_requests_status ON public.shop_requests(status);
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON public.orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_shop_id ON public.shop_revenue_transactions(shop_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);

-- Enable RLS
ALTER TABLE public.shop_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_revenue_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Shop Requests
CREATE POLICY "Users can view their own shop requests" ON public.shop_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create shop requests" ON public.shop_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all shop requests" ON public.shop_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update shop requests" ON public.shop_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies: Shops
CREATE POLICY "Shop owners can view their own shop" ON public.shops
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Everyone can view active shops" ON public.shops
  FOR SELECT USING (is_active = true);

CREATE POLICY "Shop owners can update their shop" ON public.shops
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all shops" ON public.shops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies: Shop Revenue
CREATE POLICY "Shop owners can view their revenue" ON public.shop_revenue_transactions
  FOR SELECT USING (
    shop_id IN (SELECT id FROM public.shops WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admins can view all revenue" ON public.shop_revenue_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies: Admin Actions
CREATE POLICY "Admins can view admin actions" ON public.admin_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can log actions" ON public.admin_actions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to calculate shop package limits
CREATE OR REPLACE FUNCTION get_shop_package_limits(package shop_package_type)
RETURNS TABLE(
  revenue_limit DECIMAL,
  first_shipping_support INTEGER,
  second_shipping_support INTEGER,
  deposit_amount DECIMAL
) AS $$
BEGIN
  IF package = 'BASIC' THEN
    RETURN QUERY SELECT 10000000.0::DECIMAL, 30, 0, 300000.0::DECIMAL;
  ELSIF package = 'PRO' THEN
    RETURN QUERY SELECT 30000000.0::DECIMAL, 30, 15, 500000.0::DECIMAL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to approve shop request
CREATE OR REPLACE FUNCTION approve_shop_request(request_id UUID, admin_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_request RECORD;
  v_shop_id UUID;
  v_limits RECORD;
BEGIN
  -- Get request details
  SELECT * INTO v_request FROM public.shop_requests WHERE id = request_id;
  
  IF v_request IS NULL THEN
    RAISE EXCEPTION 'Shop request not found';
  END IF;
  
  IF v_request.status != 'pending' THEN
    RAISE EXCEPTION 'Shop request already processed';
  END IF;
  
  -- Get package limits
  SELECT * INTO v_limits FROM get_shop_package_limits(v_request.package_type);
  
  -- Create shop
  INSERT INTO public.shops (
    owner_id, name, description, logo_url, address,
    package_type, revenue_limit,
    first_shipping_support_percent, second_shipping_support_percent,
    deposit_amount
  ) VALUES (
    v_request.user_id, v_request.shop_name, v_request.description,
    v_request.logo_url, v_request.address, v_request.package_type,
    v_limits.revenue_limit, v_limits.first_shipping_support,
    v_limits.second_shipping_support, v_limits.deposit_amount
  ) RETURNING id INTO v_shop_id;
  
  -- Update user role to shopOwner
  UPDATE public.user_profiles 
  SET role = 'shopOwner', shop_id = v_shop_id
  WHERE user_id = v_request.user_id;
  
  -- Update request status
  UPDATE public.shop_requests
  SET status = 'approved', reviewed_at = NOW(), reviewed_by = admin_user_id
  WHERE id = request_id;
  
  -- Log admin action
  INSERT INTO public.admin_actions (admin_id, action_type, target_type, target_id, details)
  VALUES (admin_user_id, 'approve_shop', 'shop_request', request_id, 
    jsonb_build_object('shop_id', v_shop_id, 'shop_name', v_request.shop_name));
  
  RETURN v_shop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update shop revenue
CREATE OR REPLACE FUNCTION update_shop_revenue()
RETURNS TRIGGER AS $$
DECLARE
  v_shop_id UUID;
  v_amount DECIMAL;
  v_shipping_support DECIMAL := 0;
  v_shop RECORD;
BEGIN
  -- Only process paid orders
  IF NEW.payment_status != 'paid' THEN
    RETURN NEW;
  END IF;
  
  -- Get shop from product
  SELECT shop_id INTO v_shop_id 
  FROM public.products 
  WHERE id = NEW.product_id;
  
  IF v_shop_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get shop details
  SELECT * INTO v_shop FROM public.shops WHERE id = v_shop_id;
  
  -- Calculate shipping support based on package
  IF v_shop.package_type = 'BASIC' THEN
    v_shipping_support := NEW.total_amount * 0.30;
  ELSIF v_shop.package_type = 'PRO' THEN
    -- Check order count for this shop
    IF (SELECT COUNT(*) FROM public.orders WHERE shop_id = v_shop_id AND payment_status = 'paid') = 1 THEN
      v_shipping_support := NEW.total_amount * 0.30; -- First order
    ELSE
      v_shipping_support := NEW.total_amount * 0.15; -- Subsequent orders
    END IF;
  END IF;
  
  v_amount := NEW.total_amount;
  
  -- Update shop revenue
  UPDATE public.shops 
  SET revenue = revenue + v_amount,
      updated_at = NOW()
  WHERE id = v_shop_id;
  
  -- Record transaction
  INSERT INTO public.shop_revenue_transactions (shop_id, order_id, amount, type, description)
  VALUES (v_shop_id, NEW.id, v_amount, 'sale', 'Order payment received');
  
  -- Record shipping support
  IF v_shipping_support > 0 THEN
    INSERT INTO public.shop_revenue_transactions (shop_id, order_id, amount, type, description)
    VALUES (v_shop_id, NEW.id, v_shipping_support, 'shipping_support', 'Shipping support applied');
    
    UPDATE public.orders SET shipping_support_amount = v_shipping_support WHERE id = NEW.id;
  END IF;
  
  NEW.shop_id := v_shop_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_shop_revenue
BEFORE UPDATE OF payment_status ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_shop_revenue();
