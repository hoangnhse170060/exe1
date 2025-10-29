# 🔧 HƯỚNG DẪN SETUP & TEST HỆ THỐNG

## ⚠️ LỖI HIỆN TẠI: "Supabase environment variables are not set"

Bạn cần cấu hình Supabase để hệ thống hoạt động. Làm theo các bước sau:

---

## 📝 BƯỚC 1: CẤU HÌNH SUPABASE

### 1.1. Lấy thông tin Supabase

1. Truy cập: **https://app.supabase.com**
2. Chọn project của bạn (hoặc tạo mới)
3. Vào **Settings** (biểu tượng bánh răng) → **API**
4. Copy 2 thông tin:
   - **Project URL** (dạng: `https://xxxxx.supabase.co`)
   - **anon public key** (dạng: `eyJhb...`)

### 1.2. Cập nhật file .env

Mở file `.env` vừa tạo và điền thông tin:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.3. Áp dụng Database Migrations

Vào Supabase Dashboard → **SQL Editor** và chạy các file migration theo thứ tự:

```bash
# Chạy từng file trong thư mục supabase/migrations/
1. 20251027051846_create_initial_schema.sql
2. 20251027131003_create_user_profiles.sql
3. 20251027143000_create_forum_reactions.sql
4. 20251027160000_create_orders_reviews_chats.sql
5. 20251027170000_seed_shop_mock_data.sql
6. 20251028000000_create_quiz_system.sql
7. 20251028000001_enhance_forum_system.sql
8. 20251028000002_enhance_shopping_system.sql
9. 20251028000003_create_verification_system.sql
10. 20251028000004_create_shop_system.sql
11. 20251028000005_seed_demo_accounts.sql
```

### 1.4. Tạo tài khoản test

**Cách 1: Tạo qua Supabase Dashboard (Khuyên dùng)**
1. Vào **Authentication** → **Users** → **Add user**
2. Tạo 3 tài khoản theo thông tin trong `TEST_ACCOUNTS.md`:
   - `admin@echoes.vn` / `admin123`
   - `user3@echoes.vn` / `user123`
   - `shop1@echoes.vn` / `shop123`

3. Sau khi tạo xong, vào **SQL Editor** và chạy:
```sql
-- Cập nhật role cho các tài khoản
UPDATE user_profiles 
SET role = 'admin', stars = 500
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@echoes.vn');

UPDATE user_profiles 
SET role = 'user', stars = 250
WHERE id = (SELECT id FROM auth.users WHERE email = 'user3@echoes.vn');

UPDATE user_profiles 
SET role = 'shopOwner', stars = 300, shop_id = 'some-shop-id'
WHERE id = (SELECT id FROM auth.users WHERE email = 'shop1@echoes.vn');
```

**Cách 2: Đăng ký qua app**
1. Truy cập: http://localhost:5174/register-enhanced
2. Đăng ký tài khoản mới
3. Vào Supabase Dashboard → SQL Editor để cập nhật role như trên

---

## 🚀 BƯỚC 2: RESTART SERVER

```bash
# Dừng server hiện tại (Ctrl+C)
# Build lại project
npm run build

# Chạy lại preview
npm run preview
```

---

## ✅ BƯỚC 3: TEST HỆ THỐNG

### 3.1. Test Login & Profile Page

1. Truy cập: **http://localhost:5174/login**
2. Đăng nhập bằng tài khoản test:
   - Email: `admin@echoes.vn`
   - Mật khẩu: `admin123`

3. Sau khi đăng nhập thành công → Tự động chuyển đến **Profile Page**

### 3.2. Kiểm tra Role trên Profile Page

**Bạn sẽ thấy:**

#### ✨ ADMIN Account
- Badge đỏ: **🛡️ ADMIN**
- Hiển thị số sao
- Nút "Admin Dashboard"
- Nút "Quản lý người dùng"
- Nút "Duyệt đơn mở Shop"

#### 👤 USER Account
- Badge xanh: **👤 USER**
- Hiển thị số sao
- Nếu ≥ 200 sao: Nút "Đăng ký mở Shop ngay"
- Nếu < 200 sao: Thanh progress bar + "Cần thêm X sao"

#### 🏪 SHOP OWNER Account
- Badge tím: **🏪 SHOP OWNER**
- Thông tin shop: tên, gói dịch vụ (BASIC/PRO)
- Doanh thu hiện tại
- Giới hạn doanh thu
- Progress bar doanh thu
- Nút "Quản lý Shop"

### 3.3. Test các tài khoản khác

```bash
# Test User với 250 sao (đủ điều kiện mở shop)
Email: user3@echoes.vn
Password: user123
→ Sẽ thấy nút "Đăng ký mở Shop ngay"

# Test User với 50 sao (chưa đủ điều kiện)
Email: user1@echoes.vn
Password: user123
→ Sẽ thấy "Cần thêm 150 sao để mở shop"

# Test Shop Owner - Gói Basic
Email: shop1@echoes.vn
Password: shop123
→ Sẽ thấy thông tin shop, doanh thu, gói BASIC

# Test Shop Owner - Gói Pro
Email: shop2@echoes.vn
Password: shop123
→ Sẽ thấy thông tin shop, doanh thu, gói PRO (badge vàng)
```

---

## 🎯 TÍNH NĂNG ĐÃ CÓ

### 1. Profile Page (`/profile`)
- ✅ Hiển thị thông tin user: tên, email, số điện thoại, ngày sinh
- ✅ Badge role: ADMIN (đỏ), SHOP OWNER (tím), USER (xanh)
- ✅ Hiển thị số sao với icon ⭐
- ✅ Trạng thái xác thực email/phone
- ✅ Ngày tham gia
- ✅ Responsive design với Tailwind CSS

### 2. Role-based Features

#### 👤 USER
- Progress bar tích sao
- Nút "Nâng cấp thành Shop Owner" (khi ≥ 200 sao)
- Thông báo thiếu bao nhiêu sao

#### 🏪 SHOP OWNER
- Thông tin shop chi tiết
- Doanh thu realtime
- Progress bar doanh thu/giới hạn
- Badge gói BASIC/PRO
- Link "Quản lý Shop"

#### 🛡️ ADMIN
- Dashboard quản trị
- Quản lý người dùng
- Duyệt đơn mở shop
- Analytics (sẽ implement)

### 3. Login Flow
- ✅ Đăng nhập thành công → Redirect đến `/profile`
- ✅ Hiển thị role và quyền hạn
- ✅ OAuth: Google, Facebook
- ✅ Forgot password
- ✅ Post-login action resume (nếu có hành động chưa hoàn thành trước khi login)

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Supabase environment variables are not set"
➡️ **Giải pháp**: Cấu hình file `.env` với thông tin Supabase (xem BƯỚC 1)

### Lỗi: "Không tìm thấy thông tin tài khoản"
➡️ **Giải pháp**: 
1. Kiểm tra tài khoản đã tồn tại trong `auth.users`
2. Kiểm tra đã có record trong `user_profiles`
3. Chạy lại migration `20251028000005_seed_demo_accounts.sql`

### Lỗi: Role không hiển thị đúng
➡️ **Giải pháp**: 
```sql
-- Kiểm tra role trong database
SELECT id, email, display_name, role, stars 
FROM user_profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@echoes.vn');

-- Cập nhật role nếu sai
UPDATE user_profiles SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@echoes.vn');
```

### Tài khoản không đăng nhập được
➡️ **Giải pháp**:
1. Kiểm tra email confirmation trong Supabase Dashboard
2. Vào **Authentication** → **Users** → Click user → **Confirm email**
3. Hoặc disable email confirmation: **Settings** → **Authentication** → **Email Auth** → Tắt "Confirm email"

---

## 📌 NEXT STEPS

Sau khi login thành công và thấy role trên Profile page, bạn có thể:

1. **User**: Tích sao qua quiz/shopping → Đăng ký mở shop
2. **Shop Owner**: Quản lý sản phẩm, xem đơn hàng, theo dõi doanh thu
3. **Admin**: Duyệt đơn shop, quản lý user, xem analytics

---

## 🔗 LIÊN KẾT QUAN TRỌNG

- **Preview**: http://localhost:5174
- **Profile Page**: http://localhost:5174/profile
- **Login**: http://localhost:5174/login
- **Register**: http://localhost:5174/register-enhanced
- **Supabase**: https://app.supabase.com
- **Test Accounts**: Xem file `TEST_ACCOUNTS.md`

---

## 📞 HỖ TRỢ

Nếu vẫn gặp vấn đề, cung cấp:
1. Screenshot lỗi
2. Console log (F12 → Console)
3. Network tab (F12 → Network → filter "supabase")
4. File `.env` (che mất key)
