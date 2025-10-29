import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShoppingBag,
  Star,
  User,
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  phone?: string;
  date_of_birth?: string;
  role: 'user' | 'shopOwner' | 'admin';
  stars: number;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  shop_id?: string;
  created_at: string;
}

interface ShopInfo {
  id: string;
  shop_name: string;
  package_type: 'BASIC' | 'PRO';
  revenue: number;
  revenue_limit: number;
  created_at: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [membershipDuration, setMembershipDuration] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    let resolvedProfile: UserProfile | null = null;

    try {
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        resolvedProfile = profileData as UserProfile;
        setProfile(resolvedProfile);
        setShop(null);

        if (resolvedProfile.role === 'shopOwner' && resolvedProfile.shop_id) {
          const { data: shopData } = await supabase
            .from('shops')
            .select('*')
            .eq('id', resolvedProfile.shop_id)
            .single();

          if (shopData) {
            setShop(shopData as ShopInfo);
          }
        }
      } else {
        const currentUser = localAuth.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const { profile: profileRecord, shop: shopRecord } = await localAuth.getUserProfile(currentUser.id);

        if (profileRecord) {
          const { password: _password, ...rest } = profileRecord as any;
          resolvedProfile = rest as UserProfile;
          setProfile(resolvedProfile);
          setShop(shopRecord ? (shopRecord as ShopInfo) : null);
        }
      }

      if (resolvedProfile?.created_at) {
        const createdDate = new Date(resolvedProfile.created_at);
        const now = new Date();
        const diffMonths =
          (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());

        if (diffMonths <= 0) {
          setMembershipDuration('Thành viên mới');
        } else if (diffMonths < 12) {
          setMembershipDuration(`${diffMonths} tháng gắn bó`);
        } else {
          const years = Math.floor(diffMonths / 12);
          const months = diffMonths % 12;
          setMembershipDuration(`${years} năm${months ? ` ${months} tháng` : ''}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localAuth.logout();
    }
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue-100/90 px-4 py-1.5 text-sm font-semibold text-brand-blue-800">
            <Shield className="h-4 w-4 text-brand-blue-600" />
            Admin
          </span>
        );
      case 'shopOwner':
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-sand px-4 py-1.5 text-sm font-semibold text-brand-blue-700">
            <Building2 className="h-4 w-4 text-brand-blue-600" />
            Shop Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-brand-blue-700">
            <User className="h-4 w-4 text-brand-blue-600" />
            User
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const canRequestShop = profile?.role === 'user' && profile.stars >= 200;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-base via-brand-sand to-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-brand-sand border-t-brand-blue"></div>
          <p className="text-sm text-slate-500">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-base via-brand-sand to-white">
        <div className="rounded-2xl bg-white px-10 py-12 text-center shadow-2xl">
          <p className="mb-6 text-lg font-semibold text-brand-blue-600">Không tìm thấy thông tin tài khoản</p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-brand-blue px-8 py-3 text-white shadow-brand transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-blue-600"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-base via-brand-sand to-white py-14 px-4">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px,1fr]">
          {/* Sidebar Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-brand">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-800 via-brand-blue-600 to-brand-blue-400 opacity-95"></div>
            <div className="relative flex h-full flex-col gap-6 p-8 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide">
                  {membershipDuration || 'Thành viên Echoes'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm font-medium transition hover:bg-white/25"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-md shadow-xl">
                  <User className="h-12 w-12 text-brand-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">{profile.display_name}</h1>
                <p className="text-sm text-white/80">{profile.email}</p>
              </div>

              <div className="space-y-3 rounded-3xl bg-white/15 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Vai trò</span>
                  {getRoleBadge(profile.role)}
                </div>
                <div className="flex items-center justify-between text-sm text-white/90">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Điểm Sao
                  </span>
                  <strong className="text-base">{profile.stars}</strong>
                </div>
                {profile.phone && (
                  <div className="flex items-center justify-between text-sm text-white/90">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Số điện thoại
                    </span>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-white/90">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Tham gia
                  </span>
                  <span>{formatDate(profile.created_at)}</span>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-4 text-xs text-white/70 backdrop-blur-sm">
                <p className="font-semibold uppercase tracking-wide text-white/80">Lời nhắn dành cho bạn</p>
                {profile.role === 'admin' && (
                  <p className="mt-2 leading-relaxed">
                    Hãy tiếp tục truyền cảm hứng và hỗ trợ cộng đồng Echoes phát triển bền vững.
                  </p>
                )}
                {profile.role === 'shopOwner' && (
                  <p className="mt-2 leading-relaxed">
                    Quản lý tốt chất lượng sản phẩm và dịch vụ để tạo dựng thương hiệu uy tín trong cộng đồng.
                  </p>
                )}
                {profile.role === 'user' && (
                  <p className="mt-2 leading-relaxed">
                    Tích lũy sao qua quiz, mua sắm và đóng góp tri thức để mở khóa nhiều đặc quyền hơn.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/95 p-8 shadow-xl shadow-brand backdrop-blur-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-blue-500">Thông tin cá nhân</p>
                  <h2 className="text-2xl font-semibold text-slate-800">Hồ sơ thành viên</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                  Tài khoản đã xác thực
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-brand-blue-100 bg-brand-sky/60 p-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="h-5 w-5 text-brand-blue-600" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-brand-blue-600">Email</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.email}</p>
                    </div>
                  </div>
                </div>

                {profile.phone && (
                  <div className="rounded-2xl border border-brand-blue-100 bg-brand-base/70 p-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="h-5 w-5 text-brand-blue-600" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-brand-blue-600">Số điện thoại</p>
                        <p className="text-sm font-semibold text-slate-800">{profile.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {profile.date_of_birth && (
                  <div className="rounded-2xl border border-brand-blue-100 bg-brand-sand/70 p-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar className="h-5 w-5 text-brand-blue-600" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-brand-blue-600">Ngày sinh</p>
                        <p className="text-sm font-semibold text-slate-800">{formatDate(profile.date_of_birth)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-brand-blue-100 bg-brand-sky/60 p-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Trạng thái</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {profile.role === 'admin'
                          ? 'Quản trị viên'
                          : profile.role === 'shopOwner'
                            ? 'Chủ Shop'
                            : 'Thành viên cộng đồng'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User specific block */}
            {profile.role === 'user' && (
              <div className="rounded-3xl bg-white/95 p-8 shadow-xl shadow-brand backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-blue-400">Hành trình trở thành chủ shop</p>
                    <h2 className="text-2xl font-semibold text-slate-800">Nâng cấp thành Shop Owner</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Tích lũy kinh nghiệm và sao thưởng để mở khóa đặc quyền kinh doanh cùng Echoes Market.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-brand-blue-600 via-brand-blue-500 to-brand-blue-400 px-6 py-3 text-white shadow-lg shadow-brand">
                    <span className="text-xs uppercase tracking-wide text-white/70">Điểm hiện tại</span>
                    <p className="text-xl font-semibold">
                      {profile.stars}
                      <span className="ml-1 text-sm font-medium text-white/80">/ 200 sao</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-brand-blue-100 bg-brand-sky/60 p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mốc đặc quyền</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Nhận gian hàng riêng trên Echoes Market
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Tiếp cận chương trình hỗ trợ marketing của Echoes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Tham gia workshop độc quyền dành riêng cho shop owner
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-brand-blue-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tiến độ tích luỹ sao</h3>
                    <div className="mt-4">
                      <div className="h-3 rounded-full bg-slate-200">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r from-brand-blue-600 via-brand-blue-500 to-brand-blue-400 transition-all duration-500`}
                          style={{ width: `${Math.min((profile.stars / 200) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        Bạn cần thêm <strong>{Math.max(200 - profile.stars, 0)}</strong> sao để mở shop
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-brand-blue-200 bg-brand-sky/60 p-6 text-center lg:flex-row lg:text-left">
                  {canRequestShop ? (
                    <>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-blue-600">Chúc mừng! Bạn đủ điều kiện mở shop</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Hãy hoàn tất hồ sơ để Echoes team duyệt và kích hoạt gian hàng của bạn.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/shop-request')}
                        className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-600"
                      >
                        Đăng ký mở Shop ngay
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col items-center gap-3 text-sm text-brand-blue-500 lg:flex-row lg:items-start">
                      <ShoppingBag className="h-10 w-10 text-brand-blue-400" />
                      <div>
                        <p className="font-semibold text-slate-700">Bạn cần thêm {Math.max(200 - profile.stars, 0)} sao để mở shop</p>
                        <p className="mt-1">
                          Hoàn thành quiz hàng tuần, mua sắm ở Echoes Market và chia sẻ bài viết giá trị để tích lũy thêm sao.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shop owner block */}
            {profile.role === 'shopOwner' && shop && (
              <div className="rounded-3xl bg-white/95 p-8 shadow-xl shadow-brand backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-blue-400">Thông tin gian hàng</p>
                    <h2 className="text-2xl font-semibold text-slate-800">{shop.shop_name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Hãy chăm sóc khách hàng và duy trì chỉ số tín nhiệm để nhận thêm ưu đãi từ Echoes.
                    </p>
                  </div>
                  <div className={`rounded-2xl px-6 py-3 text-sm font-semibold ${
                    shop.package_type === 'PRO'
                      ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 text-white shadow-lg'
                      : 'bg-brand-sky text-brand-blue-700'
                  }`}>
                    Gói {shop.package_type === 'PRO' ? 'PRO ✨' : 'BASIC'}
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-brand-blue-100 bg-brand-sky/60 p-6">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Doanh thu hiện tại</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-500">{formatCurrency(shop.revenue)}</p>
                    <p className="mt-1 text-xs text-slate-400">Cập nhật theo thời gian thực</p>
                  </div>
                  <div className="rounded-2xl border border-brand-blue-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Giới hạn doanh thu</p>
                    <p className="mt-2 text-lg font-semibold text-slate-800">{formatCurrency(shop.revenue_limit)}</p>
                    <div className="mt-4 h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                        style={{ width: `${Math.min((shop.revenue / shop.revenue_limit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Award className="h-5 w-5 text-emerald-500" />
                    <span>Hỗ trợ phí vận chuyển: {shop.package_type === 'PRO' ? '30% + 15%' : '30%'}</span>
                  </div>
                  <button
                    onClick={() => navigate('/shop-dashboard')}
                    className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-600"
                  >
                    Quản lý gian hàng
                  </button>
                </div>
              </div>
            )}

            {/* Admin block */}
            {profile.role === 'admin' && (
                <div className="rounded-3xl bg-white/95 p-8 shadow-xl shadow-brand backdrop-blur-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-blue-400">Trung tâm quản trị</p>
                    <h2 className="text-2xl font-semibold text-slate-800">Bảng điều khiển Admin</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Theo dõi hoạt động hệ thống và hỗ trợ cộng đồng Echoes vận hành trơn tru.
                    </p>
                  </div>
                  <Shield className="h-12 w-12 text-brand-blue-500" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <button
                    onClick={() => navigate('/admin-dashboard')}
                    className="group rounded-2xl border border-brand-blue-100 bg-brand-sky/60 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-sm font-semibold text-brand-blue-600">Dashboard tổng quan</p>
                    <p className="mt-2 text-xs text-brand-blue-500">Xem ngay báo cáo hoạt động trong ngày</p>
                  </button>
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="group rounded-2xl border border-brand-blue-100 bg-brand-base/70 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-sm font-semibold text-slate-700">Quản lý người dùng</p>
                    <p className="mt-2 text-xs text-slate-500">Cấu hình vai trò, khoá tài khoản, ghi chú vi phạm</p>
                  </button>
                  <button
                    onClick={() => navigate('/admin/shop-requests')}
                    className="group rounded-2xl border border-brand-blue-100 bg-brand-sky/60 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-sm font-semibold text-brand-blue-600">Duyệt đơn mở shop</p>
                    <p className="mt-2 text-xs text-brand-blue-500">Theo dõi hồ sơ đăng ký và phản hồi ứng viên</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
