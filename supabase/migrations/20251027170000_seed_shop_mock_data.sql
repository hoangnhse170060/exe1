-- Seed shop data to align with mock dataset used in the UI
-- Adds seller metadata columns, ensures demo accounts exist, and populates
-- products, reviews, chats, and sample orders for local development.

create extension if not exists "pgcrypto";
create extension if not exists "supabase_auth_admin";

alter table products add column if not exists seller_name text;
alter table products add column if not exists seller_title text;
alter table products add column if not exists seller_location text;
alter table products add column if not exists seller_contact text;

-- Ensure demo auth users are available for seed relationships
DO $$
DECLARE
  buyer_id constant uuid := '11111111-1111-1111-1111-111111111111';
  seller_id constant uuid := '22222222-2222-2222-2222-222222222222';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = buyer_id) THEN
    PERFORM auth.create_user(
      id => buyer_id,
      email => 'demo.buyer@echoes.vn',
      password => 'DemoPass123!',
      email_confirm => true,
      user_metadata => jsonb_build_object('full_name', 'Khách Hàng Demo')
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = seller_id) THEN
    PERFORM auth.create_user(
      id => seller_id,
      email => 'demo.seller@echoes.vn',
      password => 'DemoPass123!',
      email_confirm => true,
      user_metadata => jsonb_build_object('full_name', 'Nhà Bán Demo')
    );
  END IF;
END $$;

-- Seller records used for product ownership metadata
INSERT INTO sellers (id, name, bio, avatar_url)
VALUES
  ('70000000-0000-0000-0000-000000000001', 'Nhà sưu tập Trần Minh Hải', 'Sưu tập tranh kháng chiến', NULL),
  ('70000000-0000-0000-0000-000000000002', 'Xưởng may Di Sản', 'Thủ công truyền thống', NULL),
  ('70000000-0000-0000-0000-000000000003', 'Tiệm Tem Cổ Ánh Dương', 'Sưu tập tem Đông Dương', NULL),
  ('70000000-0000-0000-0000-000000000004', 'NXB Hồi Ức Việt', 'Tư liệu lịch sử', NULL),
  ('70000000-0000-0000-0000-000000000005', 'Studio Ký Ức Xanh', 'Điêu khắc mô hình', NULL),
  ('70000000-0000-0000-0000-000000000006', 'Nhà in Tháng Tám', 'Ấn phẩm lưu niệm', NULL)
ON CONFLICT (id) DO UPDATE
SET name = excluded.name,
    bio = excluded.bio,
    avatar_url = excluded.avatar_url;

-- Core product catalog matching the mock data
INSERT INTO products (
  id,
  name,
  description,
  price,
  image_url,
  category,
  created_at,
  seller_id,
  seller_name,
  seller_title,
  seller_location,
  seller_contact
) VALUES
  ('c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a01', 'Tranh Cổ Động Điện Biên Phủ', 'Bản in giới hạn của bức tranh cổ động chiến dịch Điện Biên Phủ, in trên giấy mỹ thuật Italia với khung gỗ lim xử lý thủ công.', 1250000, 'https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg', 'Nghệ Thuật', '2025-10-01T08:00:00Z', '70000000-0000-0000-0000-000000000001', 'Nhà sưu tập Trần Minh Hải', 'Sưu tập tranh kháng chiến', 'Hà Nội', '0938 123 456'),
  ('c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a02', 'Áo Khoác Kỷ Niệm Đường Trường Sơn', 'Áo khoác thiết kế theo phong cách quân trang Trường Sơn, chất liệu cotton canvas cao cấp, may thủ công tại Huế.', 890000, 'https://images.pexels.com/photos/2878708/pexels-photo-2878708.jpeg', 'Thời Trang', '2025-10-02T08:00:00Z', '70000000-0000-0000-0000-000000000002', 'Xưởng may Di Sản', 'Thủ công truyền thống', 'Thừa Thiên Huế', 'heritage@atelier.vn'),
  ('c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a03', 'Bộ Tem Chiến Khu Việt Bắc 1951', 'Bộ tem được bảo quản trong bìa kính, chứng nhận nguồn gốc từ nhà sưu tầm độc lập tại Bắc Giang.', 450000, 'https://images.pexels.com/photos/1010078/pexels-photo-1010078.jpeg', 'Sưu Tầm', '2025-10-03T08:00:00Z', '70000000-0000-0000-0000-000000000003', 'Tiệm Tem Cổ Ánh Dương', 'Sưu tập tem Đông Dương', 'Bắc Giang', 'zalo.me/temanhduong'),
  ('c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a04', 'Sách Ảnh Ký Ức Miền Nam 1960-1975', 'Ấn bản tái bản giới hạn gồm 300 trang ảnh tư liệu do các phóng viên chiến trường ghi lại.', 520000, 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg', 'Sách', '2025-10-04T08:00:00Z', '70000000-0000-0000-0000-000000000004', 'NXB Hồi Ức Việt', 'Tư liệu lịch sử', 'TP. Hồ Chí Minh', 'contact@hoiucc.vn'),
  ('c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a05', 'Mô hình Tàu Không Số HQ-671', 'Mô hình tàu không số tỉ lệ 1:72 với các chi tiết đồng nguyên chất, đi kèm chân đế khắc laser.', 2100000, 'https://images.pexels.com/photos/1616406/pexels-photo-1616406.jpeg', 'Thủ Công', '2025-10-05T08:00:00Z', '70000000-0000-0000-0000-000000000005', 'Studio Ký Ức Xanh', 'Điêu khắc mô hình', 'Đà Nẵng', 'info@kyucxanh.vn'),
  ('c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a06', 'Bưu Thiếp Phố Cổ Hà Nội 1954', 'Bộ 12 bưu thiếp in lại từ phim gốc, đi kèm phong bì và sổ chú thích song ngữ Việt-Anh.', 320000, 'https://images.pexels.com/photos/2779163/pexels-photo-2779163.jpeg', 'Ấn Phẩm', '2025-10-06T08:00:00Z', '70000000-0000-0000-0000-000000000006', 'Nhà in Tháng Tám', 'Ấn phẩm lưu niệm', 'Hà Nội', 'tha8printing.vn')
ON CONFLICT (id) DO UPDATE
SET name = excluded.name,
    description = excluded.description,
    price = excluded.price,
    image_url = excluded.image_url,
    category = excluded.category,
    created_at = excluded.created_at,
    seller_id = excluded.seller_id,
    seller_name = excluded.seller_name,
    seller_title = excluded.seller_title,
    seller_location = excluded.seller_location,
    seller_contact = excluded.seller_contact;

-- Reviews referencing the demo buyer
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, created_at)
VALUES
  ('d1b36f72-9a1f-4e03-b5f6-7a1e98700001', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a01', '11111111-1111-1111-1111-111111111111', 5, 'Chất lượng in sắc nét, màu sắc đẹp hơn mong đợi. Đóng gói chắc chắn.', '2025-09-12T10:15:00Z'),
  ('d1b36f72-9a1f-4e03-b5f6-7a1e98700002', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a02', '11111111-1111-1111-1111-111111111111', 4, 'Áo giữ ấm tốt, may chắc chắn. Form hơi rộng nên cần chọn nhỏ hơn một size.', '2025-08-02T08:40:00Z'),
  ('d1b36f72-9a1f-4e03-b5f6-7a1e98700003', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a04', '11111111-1111-1111-1111-111111111111', 5, 'Tài liệu quý giá, phần chú thích rất chi tiết. Đáng để sưu tầm.', '2025-07-18T13:25:00Z'),
  ('d1b36f72-9a1f-4e03-b5f6-7a1e98700004', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a05', '11111111-1111-1111-1111-111111111111', 5, 'Mô hình tinh xảo đến từng chi tiết nhỏ, cảm giác rất chân thực.', '2025-05-09T16:05:00Z')
ON CONFLICT (id) DO UPDATE
SET rating = excluded.rating,
    comment = excluded.comment,
    created_at = excluded.created_at;

-- Chat transcript samples (buyer vs seller)
INSERT INTO seller_chats (id, product_id, user_id, message, created_at)
VALUES
  ('f9a9e4d3-1be4-4cb7-a4a8-000000000001', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a02', '11111111-1111-1111-1111-111111111111', 'Áo này có size S không ạ?', '2025-10-18T09:21:00Z'),
  ('f9a9e4d3-1be4-4cb7-a4a8-000000000002', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a02', '22222222-2222-2222-2222-222222222222', 'Dạ có đủ size từ S đến XL, bạn cần mình giữ hàng giúp không?', '2025-10-18T09:25:00Z'),
  ('f9a9e4d3-1be4-4cb7-a4a8-000000000003', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a04', '11111111-1111-1111-1111-111111111111', 'Sách có kèm hộp bảo quản không anh?', '2025-09-01T11:10:00Z'),
  ('f9a9e4d3-1be4-4cb7-a4a8-000000000004', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a04', '22222222-2222-2222-2222-222222222222', 'Có kèm hộp carton cứng và túi chống ẩm bạn nhé.', '2025-09-01T11:12:00Z')
ON CONFLICT (id) DO UPDATE
SET message = excluded.message,
    created_at = excluded.created_at;

-- Sample order history for the demo buyer
INSERT INTO orders (id, user_id, product_id, quantity, created_at)
VALUES
  ('0f8fad5b-d9cb-469f-a165-708677289001', '11111111-1111-1111-1111-111111111111', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a01', 1, '2025-10-10T09:00:00Z'),
  ('0f8fad5b-d9cb-469f-a165-708677289002', '11111111-1111-1111-1111-111111111111', 'c1d8e8d1-0c7a-4c75-95d4-3e740a7f1a04', 1, '2025-10-12T14:30:00Z')
ON CONFLICT (id) DO UPDATE
SET quantity = excluded.quantity,
    created_at = excluded.created_at;
