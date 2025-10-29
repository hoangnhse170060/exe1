import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  LineChart,
  PackageCheck,
  Users,
  Star,
  Truck,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const insightCards = [
  {
    title: 'Doanh thu tháng này',
    value: '12.350.000 đ',
    trend: '+12% so với tháng trước',
    icon: LineChart,
    color: 'from-purple-500 via-indigo-500 to-blue-500',
  },
  {
    title: 'Đơn hàng hoàn tất',
    value: '86 đơn',
    trend: '+8 đơn trong 7 ngày',
    icon: PackageCheck,
    color: 'from-blue-500 via-sky-500 to-cyan-500',
  },
  {
    title: 'Khách hàng trung thành',
    value: '43 khách',
    trend: '5 khách quay lại tuần này',
    icon: Users,
    color: 'from-rose-400 via-orange-400 to-amber-400',
  },
];

const upcomingTasks = [
  {
    title: 'Chuẩn bị lô hàng Hội An',
    description: 'Hoàn tất đóng gói 15 đơn hàng gốm nghệ thuật',
    time: 'Hoàn tất trước 17:00 hôm nay',
    icon: Truck,
  },
  {
    title: 'Phản hồi đánh giá 5 sao',
    description: 'Trả lời khách hàng về trải nghiệm mua vòng cổ thủ công',
    time: 'Trong 4 giờ nữa',
    icon: MessageCircle,
  },
  {
    title: 'Kiểm tra tồn kho',
    description: 'Cập nhật số lượng sản phẩm Lụa tơ tằm Hà Đông',
    time: 'Hoàn thành trước thứ Sáu',
    icon: ShieldCheck,
  },
];

const highlightCampaigns = [
  {
    title: 'Mini game “Chạm vào di sản”',
    description: 'Tặng voucher 15% cho khách hàng tham gia chia sẻ câu chuyện văn hoá.',
  },
  {
    title: 'Workshop trực tuyến',
    description: 'Livestream hướng dẫn làm tranh sơn mài vào cuối tuần.',
  },
  {
    title: 'Ưu đãi gói PRO',
    description: 'Miễn phí phí nền tảng 1 tháng khi doanh số vượt 20 triệu.',
  },
];

const ShopDashboard = () => {
  const navigate = useNavigate();
  const weatherTip = useMemo(
    () => 'Hà Nội dự báo có mưa nhẹ. Hãy chuẩn bị bao bì chống ẩm cho các đơn hàng giao liên tỉnh.',
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-indigo-600 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
          <div className="rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
            Echoes Merchant Portal
          </div>
        </div>

        <div className="rounded-3xl bg-white/95 p-8 shadow-xl shadow-indigo-100/70 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Tổng quan hoạt động</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Heritage Crafts Control Center</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Theo dõi hiệu suất bán hàng, chất lượng dịch vụ và chỉ số hài lòng khách hàng. Điều chỉnh chiến dịch phù hợp để câu chuyện văn hoá của bạn lan toả rộng hơn.
              </p>
            </div>
            <div className="rounded-3xl bg-indigo-50 px-6 py-5 text-sm text-indigo-600">
              <p className="font-semibold">Gói đang sử dụng: BASIC</p>
              <p>Doanh thu giới hạn: 10.000.000 đ / tháng</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-indigo-500">
                <Sparkles className="h-4 w-4" />
                Nâng cấp lên PRO để nhận ưu đãi phí vận chuyển + mentor thương hiệu.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {insightCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl bg-white/95 p-6 shadow-lg shadow-indigo-100/60 backdrop-blur-sm"
            >
              <div className={`mb-4 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r ${card.color} px-4 py-2 text-white shadow`}> 
                <card.icon className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">{card.title}</span>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{card.value}</p>
              <p className="mt-3 text-sm text-slate-500">{card.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/95 p-6 shadow-lg shadow-indigo-100/70 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-slate-800">Tình hình đơn hàng</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                  <p className="text-sm text-indigo-500">Đơn đang xử lý</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">12</p>
                  <p className="mt-1 text-xs text-indigo-400">Ưu tiên hoàn tất trước 12h trưa</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/90 p-5">
                  <p className="text-sm text-slate-500">Đánh giá trung bình</p>
                  <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-amber-500">
                    <Star className="h-6 w-6 fill-current" />
                    4.8 / 5
                  </p>
                  <p className="mt-1 text-xs text-slate-400">+12 đánh giá mới trong tuần</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/95 p-6 shadow-lg shadow-indigo-100/70 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-slate-800">Các hạng mục cần chú ý</h2>
              <div className="mt-4 space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.title} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                      <task.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{task.title}</p>
                      <p className="text-sm text-slate-500">{task.description}</p>
                      <p className="mt-1 text-xs text-indigo-500">{task.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-6 text-white shadow-xl">
              <h2 className="text-lg font-semibold">Thông tin vận hành</h2>
              <p className="mt-2 text-sm text-white/90">
                {weatherTip}
              </p>
              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-xs text-white/80">
                <p>Trung tâm hỗ trợ: 1900 6868</p>
                <p>Email hỗ trợ: merchant@echoes.vn</p>
                <p>Mentor phụ trách: Hoàng Minh - 0901 234 567</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/95 p-6 shadow-lg shadow-indigo-100/70 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-slate-800">Chiến dịch nổi bật</h2>
              <div className="mt-4 space-y-4">
                {highlightCampaigns.map((campaign) => (
                  <div key={campaign.title} className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <p className="text-sm font-semibold text-indigo-600">{campaign.title}</p>
                    <p className="mt-1 text-xs text-indigo-500">{campaign.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
