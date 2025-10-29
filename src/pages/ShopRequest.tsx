import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
} from 'lucide-react';

interface ShopRequestForm {
  shopName: string;
  businessType: string;
  productFocus: string;
  story: string;
  email: string;
  phone: string;
  website: string;
  province: string;
  address: string;
  packageType: 'BASIC' | 'PRO';
  monthlyCapacity: string;
  experience: string;
}

const defaultForm: ShopRequestForm = {
  shopName: '',
  businessType: '',
  productFocus: '',
  story: '',
  email: '',
  phone: '',
  website: '',
  province: '',
  address: '',
  packageType: 'BASIC',
  monthlyCapacity: '',
  experience: '',
};

const ShopRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ShopRequestForm>(defaultForm);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            navigate('/login');
            return;
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, email, phone')
            .eq('id', user.id)
            .single();

          if (!profile) {
            navigate('/profile');
            return;
          }

          setDisplayName(profile.display_name);
          setFormData((prev) => ({
            ...prev,
            email: profile.email || '',
            phone: profile.phone || '',
          }));
        } else {
          const currentUser = localAuth.getCurrentUser();
          if (!currentUser) {
            navigate('/login');
            return;
          }

          const { profile } = await localAuth.getUserProfile(currentUser.id);
          if (!profile) {
            navigate('/profile');
            return;
          }

          const { password: _password, ...rest } = profile as any;

          setDisplayName(rest.display_name);
          setFormData((prev) => ({
            ...prev,
            email: rest.email,
            phone: rest.phone || '',
          }));

          if (rest.role !== 'shopOwner' && rest.stars < 200) {
            navigate('/profile');
            return;
          }
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleChange = (field: keyof ShopRequestForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isSupabaseConfigured) {
        const { error: insertError } = await supabase.from('shop_requests').insert([
          {
            shop_name: formData.shopName,
            business_type: formData.businessType,
            product_focus: formData.productFocus,
            brand_story: formData.story,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            province: formData.province,
            address: formData.address,
            package_type: formData.packageType,
            monthly_capacity: formData.monthlyCapacity,
            experience: formData.experience,
            status: 'pending',
          },
        ]);

        if (insertError) {
          // Gracefully fallback to local storage when table is not ready in demo environments
          const message = insertError.message?.toLowerCase() ?? '';
          const shouldFallback = message.includes('relation "shop_requests"') || message.includes('does not exist');
          if (!shouldFallback) {
            throw insertError;
          }

          const requests = localStorage.getItem('echoes_shop_requests');
          const parsed: ShopRequestForm[] = requests ? JSON.parse(requests) : [];
          parsed.push(formData);
          localStorage.setItem('echoes_shop_requests', JSON.stringify(parsed));
        }
      } else {
        // Persist draft request locally for demo purposes
        const requests = localStorage.getItem('echoes_shop_requests');
        const parsed: ShopRequestForm[] = requests ? JSON.parse(requests) : [];
        parsed.push(formData);
        localStorage.setItem('echoes_shop_requests', JSON.stringify(parsed));
      }

      setSubmitted(true);
      setFormData(defaultForm);
    } catch (submitError) {
      console.error(submitError);
      setError('Không thể gửi đơn đăng ký. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f5f5ff] via-[#edf3ff] to-[#fdf5ff]">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-xl">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-600">Đang tải biểu mẫu đăng ký shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5ff] via-[#edf3ff] to-[#fdf5ff] py-12 px-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại hồ sơ
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-50/70">
          <div className="relative bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 px-10 py-12 text-white">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0, transparent 60%)' }} />
            <div className="relative flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
                Echoes Market
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Đơn đăng ký mở Shop</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/80">
                  Hoàn thiện hồ sơ kinh doanh để đội ngũ Echoes đánh giá và kích hoạt gian hàng của bạn. Chúng tôi ưu tiên các đối tác có câu chuyện văn hoá, sản phẩm độc đáo và khả năng phục vụ bền vững.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Thời gian duyệt trung bình: 3-5 ngày làm việc
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Liên hệ hỗ trợ: vendor@echoes.vn
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 px-10 py-12">
            {submitted ? (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <h2 className="mt-4 text-xl font-semibold text-emerald-700">
                  Cảm ơn {displayName}! Đơn đăng ký của bạn đã được ghi nhận.
                </h2>
                <p className="mt-3 text-sm text-emerald-600">
                  Đội ngũ Echoes sẽ liên hệ trong vòng 5 ngày làm việc để xác minh thông tin và hướng dẫn các bước tiếp theo.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-600 shadow hover:bg-emerald-100"
                >
                  Gửi thêm đơn khác
                </button>
              </div>
            ) : (
              <>
                <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                  <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thông tin thương hiệu</h2>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Tên thương hiệu / Shop *</label>
                      <input
                        required
                        value={formData.shopName}
                        onChange={(e) => handleChange('shopName', e.target.value)}
                        placeholder="Ví dụ: Echoes Craft Studio"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-slate-500">Loại hình kinh doanh *</label>
                        <input
                          required
                          value={formData.businessType}
                          onChange={(e) => handleChange('businessType', e.target.value)}
                          placeholder="Thủ công mỹ nghệ, nông sản, dịch vụ..."
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500">Nhóm sản phẩm chủ lực *</label>
                        <input
                          required
                          value={formData.productFocus}
                          onChange={(e) => handleChange('productFocus', e.target.value)}
                          placeholder="Ví dụ: Đồ gốm, ẩm thực, tour địa phương"
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Câu chuyện thương hiệu *</label>
                      <textarea
                        required
                        value={formData.story}
                        onChange={(e) => handleChange('story', e.target.value)}
                        rows={4}
                        placeholder="Chia sẻ hành trình, giá trị cốt lõi và định hướng phát triển của thương hiệu"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Gói hợp tác đề xuất</h2>
                    <div className="grid gap-4">
                      <label className={`relative cursor-pointer rounded-2xl border px-5 py-4 text-sm shadow-sm transition ${
                        formData.packageType === 'BASIC'
                          ? 'border-indigo-400 bg-indigo-50/60 shadow-lg shadow-indigo-100'
                          : 'border-slate-200 hover:border-indigo-200'
                      }`}>
                        <input
                          type="radio"
                          name="packageType"
                          value="BASIC"
                          checked={formData.packageType === 'BASIC'}
                          onChange={() => handleChange('packageType', 'BASIC')}
                          className="hidden"
                        />
                        <p className="font-semibold text-indigo-500">Starter Pack</p>
                        <p className="mt-1 text-xs text-slate-500">Phù hợp thương hiệu mới, hỗ trợ thiết lập gian hàng và 3 chiến dịch marketing cơ bản.</p>
                      </label>
                      <label className={`relative cursor-pointer rounded-2xl border px-5 py-4 text-sm shadow-sm transition ${
                        formData.packageType === 'PRO'
                          ? 'border-purple-400 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 shadow-lg shadow-purple-100'
                          : 'border-slate-200 hover:border-purple-200'
                      }`}>
                        <input
                          type="radio"
                          name="packageType"
                          value="PRO"
                          checked={formData.packageType === 'PRO'}
                          onChange={() => handleChange('packageType', 'PRO')}
                          className="hidden"
                        />
                        <p className="font-semibold text-purple-500">Growth Pack</p>
                        <p className="mt-1 text-xs text-slate-500">Bao gồm ưu đãi phí vận chuyển, cố vấn thương hiệu và chiến dịch truyền thông chuyên sâu.</p>
                      </label>
                    </div>
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-500">
                      <p className="font-semibold text-slate-600">Tài liệu đề xuất</p>
                      <p className="mt-1">Đính kèm profile thương hiệu, catalogue sản phẩm hoặc chứng nhận chất lượng (nếu có).</p>
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-500 shadow hover:bg-indigo-50"
                      >
                        <Upload className="h-4 w-4" />
                        Tải tài liệu tham khảo
                      </button>
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                  <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thông tin liên hệ</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Mail className="h-4 w-4 text-indigo-500" /> Email liên hệ *
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Phone className="h-4 w-4 text-indigo-500" /> Số điện thoại *
                        </label>
                        <input
                          required
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Website / Kênh bán hàng</label>
                      <input
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="Ví dụ: https://store.echoes.vn"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <MapPin className="h-4 w-4 text-indigo-500" /> Tỉnh / Thành *
                        </label>
                        <input
                          required
                          value={formData.province}
                          onChange={(e) => handleChange('province', e.target.value)}
                          placeholder="Ví dụ: Hà Nội"
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500">Địa chỉ cụ thể *</label>
                        <input
                          required
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          placeholder="Số nhà, đường, phường/xã"
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quy mô & kinh nghiệm</h2>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Sản lượng / tháng (ước tính) *</label>
                      <input
                        required
                        value={formData.monthlyCapacity}
                        onChange={(e) => handleChange('monthlyCapacity', e.target.value)}
                        placeholder="Ví dụ: 200 đơn / tháng"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Kinh nghiệm vận hành *</label>
                      <textarea
                        required
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        rows={4}
                        placeholder="Kinh nghiệm quản lý, đối tác đang hợp tác, các kênh đã triển khai..."
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-xs text-slate-500">
                      <p className="font-semibold text-slate-600">Lưu ý</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Echoes ưu tiên thương hiệu có tiêu chuẩn bền vững & câu chuyện văn hoá rõ ràng.</li>
                        <li>• Vui lòng đảm bảo thông tin liên hệ chính xác để chúng tôi phản hồi nhanh nhất.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {error && (
                  <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-600">
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-sm text-slate-500 lg:flex-row">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                    <FileText className="h-4 w-4" />
                    Điền đầy đủ thông tin để tăng tỷ lệ xét duyệt
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {submitting ? 'Đang gửi...' : 'Gửi đơn đăng ký'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopRequest;
