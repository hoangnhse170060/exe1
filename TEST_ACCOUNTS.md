# 🔐 Danh Sách Tài Khoản Test

## 📋 Tổng Quan

File này chứa danh sách tài khoản mẫu để test hệ thống. **Chỉ dùng cho môi trường development/testing!**

---

## 👑 ADMIN ACCOUNTS (Quản Trị Viên)

### Admin 1
- **Email:** `admin@echoes.vn`
- **Password:** `admin123`
- **Role:** Admin
- **Quyền:** Full system access
- **Tính năng:**
  - Xem tất cả users
  - Duyệt shop requests
  - Quản lý payments
  - Xem analytics
  - Ban/unban users

### Admin 2
- **Email:** `admin2@echoes.vn`
- **Password:** `admin123`
- **Role:** Admin
- **Quyền:** Full system access

### Admin 3
- **Email:** `admin3@echoes.vn`
- **Password:** `admin123`
- **Role:** Admin
- **Quyền:** Full system access

---

## 👤 USER ACCOUNTS (Người Dùng Thường)

### User 1 - Beginner
- **Email:** `user1@echoes.vn`
- **Password:** `user123`
- **Display Name:** Nguyen Van A
- **Phone:** 0901234567
- **Stars:** 50 ⭐
- **Status:** Người dùng mới
- **Có thể:**
  - Xem nội dung
  - Mua sắm
  - Tham gia forum
  - Làm quiz để tăng sao

### User 2 - Intermediate
- **Email:** `user2@echoes.vn`
- **Password:** `user123`
- **Display Name:** Tran Thi B
- **Phone:** 0901234568
- **Stars:** 150 ⭐
- **Status:** Đang tích luỹ sao
- **Cần thêm:** 50 sao để mở shop

### User 3 - Eligible for Shop ✅
- **Email:** `user3@echoes.vn`
- **Password:** `user123`
- **Display Name:** Le Van C
- **Phone:** 0901234569
- **Stars:** 250 ⭐
- **Status:** **ĐỦ ĐIỀU KIỆN MỞ SHOP!**
- **Có thể:**
  - Đăng ký mở shop
  - Chọn gói Basic (300K) hoặc Pro (500K)
  - Upload logo và thông tin shop

### User 4 - Almost There
- **Email:** `user4@echoes.vn`
- **Password:** `user123`
- **Display Name:** Pham Thi D
- **Phone:** 0901234570
- **Stars:** 180 ⭐
- **Status:** Gần đủ điều kiện
- **Cần thêm:** 20 sao

### User 5 - Eligible for Shop ✅
- **Email:** `user5@echoes.vn`
- **Password:** `user123`
- **Display Name:** Hoang Van E
- **Phone:** 0901234571
- **Stars:** 300 ⭐
- **Status:** **ĐỦ ĐIỀU KIỆN MỞ SHOP!**

---

## 🏪 SHOP OWNER ACCOUNTS (Chủ Shop)

### Shop Owner 1 - Basic Package
- **Email:** `shop1@echoes.vn`
- **Password:** `shop123`
- **Display Name:** Heritage Crafts Owner
- **Shop Name:** Heritage Crafts
- **Package:** BASIC (300K VNĐ)
- **Revenue Limit:** 10,000,000 VNĐ
- **Shipping Support:** 30% first order
- **Status:** Active
- **Có thể:**
  - Quản lý sản phẩm
  - Xem đơn hàng
  - Theo dõi doanh thu
  - Quản lý shipping

### Shop Owner 2 - Pro Package
- **Email:** `shop2@echoes.vn`
- **Password:** `shop123`
- **Display Name:** Vietnam Treasures Owner
- **Shop Name:** Vietnam Treasures
- **Package:** PRO (500K VNĐ)
- **Revenue Limit:** 30,000,000 VNĐ
- **Shipping Support:** 
  - 30% first order
  - 15% subsequent orders
- **Status:** Active
- **Có thể:**
  - Tất cả tính năng Basic
  - Analytics nâng cao
  - Priority display
  - Higher revenue limit

---

## 🔧 Cách Tạo Tài Khoản

### Phương Pháp 1: Qua Supabase Dashboard (Khuyến nghị)

1. Vào **Supabase Dashboard**: https://app.supabase.com
2. Chọn project của bạn
3. Vào **Authentication** → **Users**
4. Click **"Add user"** → **"Create new user"**
5. Nhập email và password từ danh sách trên
6. Click **"Create user"**
7. Click vào user vừa tạo → Tab **"Confirm"** → Click **"Confirm user"**
8. Chạy migration `20251028000005_seed_demo_accounts.sql` trong **SQL Editor** để set role và stars

### Phương Pháp 2: Qua Application

1. Mở browser: http://localhost:5174/register
2. Đăng ký từng tài khoản với email/password ở trên
3. Verify email (check console log để lấy OTP)
4. Sau khi đăng ký xong, chạy UPDATE queries trong migration để set role và stars

### Phương Pháp 3: Tự Động (Nếu có Service Role Key)

```bash
# Sử dụng Supabase CLI hoặc Admin API
# Cần SUPABASE_SERVICE_ROLE_KEY
```

---

## ✅ Kiểm Tra Tài Khoản Đã Tạo

Chạy query này trong Supabase SQL Editor:

```sql
SELECT 
  au.email,
  up.role,
  up.stars,
  up.metadata->>'displayName' as display_name,
  CASE 
    WHEN up.role = 'admin' THEN '👑 Full Access'
    WHEN up.role = 'shopOwner' THEN '🏪 Shop Owner'
    WHEN up.stars >= 200 THEN '✅ Can Request Shop'
    ELSE '👤 Regular User'
  END as status
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE au.email LIKE '%@echoes.vn'
ORDER BY 
  CASE up.role 
    WHEN 'admin' THEN 1 
    WHEN 'shopOwner' THEN 2 
    ELSE 3 
  END,
  up.stars DESC;
```

---

## 🧪 Testing Scenarios

### Scenario 1: User Shopping Flow
- Login as: `user1@echoes.vn`
- Browse products
- Add to cart
- Complete checkout
- View order details

### Scenario 2: Shop Request Flow
- Login as: `user3@echoes.vn` (250 stars)
- Navigate to profile
- Click "Request Shop Access"
- Fill shop registration form
- Choose package (Basic or Pro)
- Upload payment proof
- Wait for admin approval

### Scenario 3: Admin Approval Flow
- Login as: `admin@echoes.vn`
- Navigate to admin dashboard
- View pending shop requests
- Review user3's request
- Approve with notes
- User3 becomes shopOwner

### Scenario 4: Shop Management
- Login as: `shop1@echoes.vn`
- Navigate to shop dashboard
- Add products
- View orders
- Check revenue stats
- Monitor shipping support

### Scenario 5: Quiz & Stars
- Login as: `user4@echoes.vn` (180 stars)
- Take quizzes
- Earn 20+ stars
- Reach 200 stars
- Shop request button appears

---

## 🎯 Testing Checklist

### Authentication
- [ ] Login with admin account
- [ ] Login with user account
- [ ] Login with shop owner account
- [ ] Test forgot password
- [ ] Test OAuth login (Google/Facebook)

### User Features
- [ ] View profile with stars
- [ ] Browse products
- [ ] Add to cart
- [ ] Complete purchase
- [ ] View order history
- [ ] Post in forum
- [ ] Take quiz

### Shop Features (user3/user5)
- [ ] See "Request Shop" button (≥200 stars)
- [ ] Fill shop request form
- [ ] Select package
- [ ] Upload payment proof
- [ ] Submit request

### Shop Owner Features (shop1/shop2)
- [ ] View shop dashboard
- [ ] Add/edit/delete products
- [ ] View orders
- [ ] Check revenue
- [ ] Monitor shipping support
- [ ] View statistics

### Admin Features
- [ ] View all users
- [ ] View shop requests
- [ ] Approve/reject requests
- [ ] View payments
- [ ] Ban/unban users
- [ ] View analytics

---

## ⚠️ Security Warnings

1. **CHỈ DÙNG CHO TESTING!**
2. **KHÔNG BAO GIỜ sử dụng passwords đơn giản này trong production**
3. **Đổi tất cả passwords ngay sau khi test xong**
4. **Xóa tài khoản test trước khi deploy production**
5. **Không commit file này vào public repository**

---

## 📊 Account Summary Table

| Email | Password | Role | Stars | Status | Can Request Shop? |
|-------|----------|------|-------|--------|-------------------|
| admin@echoes.vn | admin123 | admin | 0 | 👑 Admin | N/A |
| admin2@echoes.vn | admin123 | admin | 0 | 👑 Admin | N/A |
| admin3@echoes.vn | admin123 | admin | 0 | 👑 Admin | N/A |
| user1@echoes.vn | user123 | user | 50 | 👤 Beginner | ❌ |
| user2@echoes.vn | user123 | user | 150 | 👤 Intermediate | ❌ |
| user3@echoes.vn | user123 | user | 250 | 👤 Eligible | ✅ |
| user4@echoes.vn | user123 | user | 180 | 👤 Almost | ❌ |
| user5@echoes.vn | user123 | user | 300 | 👤 Eligible | ✅ |
| shop1@echoes.vn | shop123 | shopOwner | N/A | 🏪 Basic | N/A |
| shop2@echoes.vn | shop123 | shopOwner | N/A | 🏪 Pro | N/A |

---

## 🔄 Quick Setup Commands

### 1. Create accounts in Supabase Dashboard
```
Visit: https://app.supabase.com
→ Authentication → Users → Add user
```

### 2. Run migration to set roles/stars
```sql
-- In Supabase SQL Editor, run:
\i supabase/migrations/20251028000005_seed_demo_accounts.sql
```

### 3. Verify accounts created
```sql
SELECT email, role, stars FROM auth.users 
LEFT JOIN user_profiles ON auth.users.id = user_profiles.user_id
WHERE email LIKE '%@echoes.vn';
```

---

## 💡 Tips

- **Admin accounts** có full access, test admin dashboard
- **user3 và user5** để test shop request flow (đủ 200 sao)
- **shop1** để test Basic package features
- **shop2** để test Pro package features
- **user1, user2, user4** để test regular user flow và tích luỹ sao

---

## 📞 Troubleshooting

### Tài khoản không login được?
- Kiểm tra email đã confirmed trong Supabase Dashboard chưa
- Kiểm tra password đúng chưa (case sensitive)
- Xóa cache browser và thử lại

### Role/Stars không đúng?
- Chạy lại UPDATE queries trong migration
- Kiểm tra `user_profiles` table có record chưa

### Shop request button không xuất hiện?
- Kiểm tra stars ≥ 200
- Check role = 'user' (không phải admin hoặc shopOwner)
- Xóa cache và refresh page

---

**Last Updated:** October 28, 2025  
**Environment:** Development/Testing Only  
**Security Level:** 🔓 Low (Test accounts)
