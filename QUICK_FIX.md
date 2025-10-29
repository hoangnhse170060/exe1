# ⚡ QUICK FIX: Màn Hình Trắng

## 🐛 Lỗi
```
Uncaught Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL
```

## ✅ Giải Pháp Nhanh (3 cách)

### Cách 1: Xóa file .env (NHANH NHẤT) ⚡
```bash
rm .env
npm run build
npm run preview
```

### Cách 2: Comment placeholders trong .env
```bash
# Mở file .env và comment 2 dòng này:
# VITE_SUPABASE_URL=your_supabase_url_here
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Cách 3: Điền URL thật từ Supabase
```bash
# Vào https://app.supabase.com → Settings → API
# Copy URL và Key thật, điền vào .env:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 🎯 Sau khi fix
- ✅ Reload trang: http://localhost:5174/
- ✅ Thấy màu gradient tím-xanh-hồng
- ✅ Sidebar + content hiển thị bình thường

## 📚 Chi tiết
Xem file `FIX_BLANK_SCREEN.md`
