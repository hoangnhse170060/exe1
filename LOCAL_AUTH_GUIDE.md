# 🔐 HƯỚNG DẪN ĐĂNG NHẬP - LOCAL AUTH

## ✅ HOÀN TẤT! Local Authentication System đã được tích hợp

Bây giờ bạn có thể **đăng nhập thật** mà không cần setup Supabase!

---

## 🎯 CÁCH ĐĂNG NHẬP

### Bước 1: Mở trang login
```
http://localhost:5174/login
```

### Bước 2: Chọn tài khoản từ danh sách

#### 🛡️ ADMIN (3 tài khoản)
```
Email: admin@echoes.vn
Password: admin123
→ Xem: Admin Dashboard, Quản lý users, Duyệt shop requests

Email: admin2@echoes.vn  |  admin3@echoes.vn
Password: admin123
```

#### 👤 USER (5 tài khoản)
```
Email: user1@echoes.vn
Password: user123
Stars: 50 (chưa đủ mở shop)

Email: user2@echoes.vn
Password: user123
Stars: 150 (chưa đủ mở shop)

Email: user3@echoes.vn
Password: user123
Stars: 250 ✅ ĐỦ ĐIỀU KIỆN MỞ SHOP

Email: user4@echoes.vn
Password: user123
Stars: 180 (chưa đủ mở shop)

Email: user5@echoes.vn
Password: user123
Stars: 300 ✅ ĐỦ ĐIỀU KIỆN MỞ SHOP
```

#### 🏪 SHOP OWNER (2 tài khoản)
```
Email: shop1@echoes.vn
Password: shop123
Package: BASIC (300K, limit 10M, 30% shipping)

Email: shop2@echoes.vn
Password: shop123
Package: PRO (500K, limit 30M, 30%+15% shipping)
```

---

## 🧪 TEST SCENARIOS

### Test 1: Admin Login
1. Login: `admin@echoes.vn` / `admin123`
2. Chuyển đến `/profile`
3. **Thấy**:
   - Badge đỏ: 🛡️ ADMIN
   - 500 sao
   - 3 nút: Admin Dashboard, Quản lý users, Duyệt shop

### Test 2: User chưa đủ sao
1. Login: `user1@echoes.vn` / `user123`
2. Chuyển đến `/profile`
3. **Thấy**:
   - Badge xanh: 👤 USER
   - 50 sao
   - Progress bar: "Cần thêm 150 sao để mở shop"

### Test 3: User đủ điều kiện mở shop
1. Login: `user3@echoes.vn` / `user123`
2. Chuyển đến `/profile`
3. **Thấy**:
   - Badge xanh: 👤 USER
   - 250 sao
   - Nút màu tím: "Đăng ký mở Shop ngay" ✅

### Test 4: Shop Owner
1. Login: `shop1@echoes.vn` / `shop123`
2. Chuyển đến `/profile`
3. **Thấy**:
   - Badge tím: 🏪 SHOP OWNER
   - Thông tin shop: Heritage Crafts
   - Gói BASIC
   - Doanh thu: 0 ₫ / 10,000,000 ₫
   - Nút "Quản lý Shop"

---

## 🎨 TÀI KHOẢN MỚI

### Đăng ký tài khoản của bạn:
1. Vào: http://localhost:5174/register
2. Điền form:
   - Tên hiển thị
   - Email (bất kỳ)
   - Password
   - Xác nhận password
3. Click "Đăng ký"
4. Tự động chuyển đến `/login`
5. Login bằng email/password vừa tạo

**Lưu ý**: Tài khoản mới sẽ có:
- Role: USER
- Stars: 0
- Chưa verify email/phone

---

## 🔧 CÁCH HOẠT ĐỘNG

### Local Auth System lưu data ở đâu?
```
localStorage.setItem('local_users', [...])
localStorage.setItem('local_current_user', {...})
localStorage.setItem('local_shops', [...])
```

### Xóa tất cả data local:
```javascript
// Mở Console (F12) và chạy:
localStorage.clear()
// Reload page → Tất cả accounts sẽ được seed lại
```

### Check user đang login:
```javascript
// Mở Console (F12) và chạy:
JSON.parse(localStorage.getItem('local_current_user'))
```

---

## 🎯 TÍNH NĂNG ĐÃ CÓ

### ✅ Login/Logout
- Email + Password authentication
- Check user credentials
- Lưu session trong localStorage
- Logout và clear session

### ✅ Register
- Tạo tài khoản mới
- Check email duplicate
- Auto-assign role: USER, stars: 0

### ✅ Profile Page
- Hiển thị thông tin user
- Badge theo role (Admin/Shop/User)
- Số sao, email, phone, ngày sinh
- Shop info (nếu là shop owner)
- Nút upgrade shop (nếu ≥200 stars)

### ✅ Role-based UI
- Admin: Thấy admin buttons
- Shop Owner: Thấy shop dashboard button
- User: Thấy progress bar + shop upgrade button

---

## 🚀 MIGRATE QUA SUPABASE (Tùy chọn)

Khi muốn dùng Supabase thật:
1. Setup Supabase project
2. Điền credentials vào `.env`
3. Code tự động switch sang Supabase
4. Import data từ localStorage (nếu cần)

---

## 📱 DEMO NGAY

**1. Login thử:**
```
URL: http://localhost:5174/login
Email: admin@echoes.vn
Password: admin123
```

**2. Xem profile:**
→ Tự động redirect đến `/profile` sau login
→ Thấy badge ADMIN màu đỏ với 500 sao

**3. Logout:**
→ Click nút "Đăng xuất"
→ Redirect về `/login`

---

✅ **HỆ THỐNG ĐÃ SẴN SÀNG!** Hãy thử login với bất kỳ tài khoản nào ở trên!
