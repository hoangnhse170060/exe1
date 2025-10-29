import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Inbox,
  LifeBuoy,
  LineChart,
  Package,
  Search,
  Shield,
  Store,
  Users,
} from 'lucide-react';
import { adminWorkflows, workflowKeysOrdered } from '../data/adminWorkflows';
import type { WorkflowKey } from '../data/adminWorkflows';
import type {
  StatCard,
  QuickAction,
  ShopRequest,
  UserAlert,
  PaymentQueueItem,
  SystemActivityItem,
  ShopPerformanceItem,
  WorkflowFocus,
} from '../types/adminDashboard';


const statCards: StatCard[] = [
  {
    title: 'Người dùng toàn hệ thống',
    value: '12,584',
    change: '+320 tuần này',
    icon: Users,
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    description: 'Tổng lượng user hoạt động cùng biến động theo tuần giúp đánh giá độ khỏe của hệ thống.',
    operations: [
      { label: 'Xem phân bổ user', variant: 'primary' },
      { label: 'Tạo cohort giữ chân', variant: 'secondary' },
      { label: 'Xuất danh sách segment' },
    ],
    targetWorkflow: 'users',
  },
  {
    title: 'Shop đang hoạt động',
    value: '148',
    change: '5 shop mới duyệt',
    icon: Store,
    gradient: 'from-emerald-400 via-green-500 to-lime-500',
    description: 'Các shop đã go-live và hoạt động tuần này, gồm cả những shop mới được kích hoạt.',
    operations: [
      { label: 'Xem bảng sức khỏe shop', variant: 'primary' },
      { label: 'Gửi checklist onboarding', variant: 'secondary' },
      { label: 'Tạo chiến dịch upsell' },
    ],
    targetWorkflow: 'shops',
  },
  {
    title: 'Đơn mở shop đang chờ',
    value: '09',
    change: 'Cần xử lý trước 12h',
    icon: Inbox,
    gradient: 'from-amber-400 via-orange-400 to-rose-400',
    description: 'Số lượng hồ sơ đang chờ phê duyệt hoặc bổ sung chứng từ trong ngày.',
    operations: [
      { label: 'Ưu tiên xử lý hồ sơ', variant: 'primary' },
      { label: 'Gửi nhắc chứng từ', variant: 'secondary' },
      { label: 'Phân công chuyên viên' },
    ],
    targetWorkflow: 'shops',
  },
  {
    title: 'Doanh thu tháng 10',
    value: '₫1.24B',
    change: '+18% so với tháng trước',
    icon: LineChart,
    gradient: 'from-fuchsia-500 via-purple-500 to-rose-500',
    description: 'Tổng doanh thu được ghi nhận và đối soát trong tháng hiện tại.',
    operations: [
      { label: 'Phân tích theo gói', variant: 'primary' },
      { label: 'Xuất báo cáo tài chính', variant: 'secondary' },
      { label: 'Gửi forecast cho Finance' },
    ],
    targetWorkflow: 'analytics',
  },
];

const quickActions: QuickAction[] = [
  {
    label: 'Duyệt đơn mở shop',
    description: '3 đơn đang chờ xác thực thanh toán',
    icon: CheckCircle2,
    accent: 'bg-indigo-50 text-indigo-600',
    operations: [
      { label: 'Mở hàng đợi hôm nay', variant: 'primary' },
      { label: 'Đính kèm biên bản bổ sung', variant: 'secondary' },
      { label: 'Giao ticket cho chuyên viên' },
    ],
    targetWorkflow: 'shops',
  },
  {
    label: 'Quản lý người dùng',
    description: '2 tài khoản bị báo cáo trong 24h qua',
    icon: Shield,
    accent: 'bg-emerald-50 text-emerald-600',
    operations: [
      { label: 'Mở danh sách cảnh báo', variant: 'primary' },
      { label: 'Khởi tạo chiến dịch retention', variant: 'secondary' },
      { label: 'Xem lịch sử escalated' },
    ],
    targetWorkflow: 'users',
  },
  {
    label: 'Đối soát thanh toán',
    description: '4 khoản đặt cọc cần kiểm tra chứng từ',
    icon: CreditCard,
    accent: 'bg-amber-50 text-amber-600',
    operations: [
      { label: 'Bắt đầu phiên đối soát', variant: 'primary' },
      { label: 'Gửi checklist bổ sung', variant: 'secondary' },
      { label: 'Đánh dấu hoàn tất' },
    ],
    targetWorkflow: 'payments',
  },
];

const shopRequests: ShopRequest[] = [
  {
    id: 'REQ-2025-1042',
    shopName: 'Gốm Việt Heritage',
    owner: 'Trần Minh Hải',
    packageType: 'PRO',
    stars: 248,
    paymentStatus: 'verifying',
    status: 'pending',
    submittedAt: '28/10/2025 09:24',
    email: 'hai.tran@example.com',
    phone: '0901 234 567',
  },
  {
    id: 'REQ-2025-1039',
    shopName: 'Thủ Công Hội An',
    owner: 'Lê Thuỷ Tiên',
    packageType: 'BASIC',
    stars: 212,
    paymentStatus: 'waiting',
    status: 'inReview',
    submittedAt: '27/10/2025 16:45',
    email: 'tien.le@example.com',
    phone: '0912 556 889',
  },
  {
    id: 'REQ-2025-1033',
    shopName: 'Ký Ức Đông Dương',
    owner: 'Nguyễn Quốc Đạt',
    packageType: 'PRO',
    stars: 305,
    paymentStatus: 'verified',
    status: 'approved',
    submittedAt: '26/10/2025 11:12',
    email: 'dat.nguyen@example.com',
    phone: '0976 443 128',
  },
  {
    id: 'REQ-2025-1027',
    shopName: 'Tranh Phố Cổ',
    owner: 'Phạm Gia Huy',
    packageType: 'BASIC',
    stars: 184,
    paymentStatus: 'missing',
    status: 'rejected',
    submittedAt: '24/10/2025 15:30',
    email: 'huy.pham@example.com',
    phone: '0988 776 320',
  },
];

const requestStatusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  inReview: 'bg-sky-100 text-sky-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

const requestStatusLabels: Record<string, string> = {
  pending: 'Chờ kiểm tra',
  inReview: 'Đang xem xét',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

const paymentStatusStyles: Record<string, string> = {
  waiting: 'bg-amber-50 text-amber-600',
  verifying: 'bg-sky-50 text-sky-600',
  verified: 'bg-emerald-50 text-emerald-600',
  missing: 'bg-rose-50 text-rose-600',
  escalated: 'bg-purple-50 text-purple-600',
  completed: 'bg-slate-100 text-slate-600',
};

const paymentStatusLabels: Record<string, string> = {
  waiting: 'Chờ chuyển khoản',
  verifying: 'Đang đối soát',
  verified: 'Đã xác nhận',
  missing: 'Thiếu chứng từ',
  escalated: 'Cần can thiệp',
  completed: 'Hoàn tất',
};


const userAlerts: UserAlert[] = [
  {
    id: 'user-0045',
    name: 'Phạm Quốc Anh',
    issue: 'Báo cáo spam diễn đàn (3 lần)',
    stars: 45,
    lastAction: '27/10/2025 21:14',
    severity: 'warning',
  },
  {
    id: 'user-0192',
    name: 'Lê Ngọc Hà',
    issue: 'Yêu cầu đặt lại mật khẩu khẩn cấp',
    stars: 120,
    lastAction: '28/10/2025 07:42',
    severity: 'info',
  },
  {
    id: 'shop-0007',
    name: 'Metro Craft Studio',
    issue: 'Bị khoá tạm thời do phí chậm thanh toán',
    stars: 0,
    lastAction: '26/10/2025 18:03',
    severity: 'critical',
  },
];

const alertSeverityStyles: Record<string, string> = {
  info: 'border-sky-100 bg-sky-50 text-sky-700',
  warning: 'border-amber-100 bg-amber-50 text-amber-700',
  critical: 'border-rose-100 bg-rose-50 text-rose-700',
};

const paymentQueue: PaymentQueueItem[] = [
  {
    id: 'PAY-9382',
    shopName: 'Gốm Việt Heritage',
    owner: 'Trần Minh Hải',
    amount: 500000,
    method: 'Momo',
    submittedAt: '28/10/2025 08:40',
    status: 'verifying',
  },
  {
    id: 'PAY-9374',
    shopName: 'Thủ Công Hội An',
    owner: 'Lê Thuỷ Tiên',
    amount: 300000,
    method: 'Chuyển khoản',
    submittedAt: '27/10/2025 19:20',
    status: 'waiting',
  },
  {
    id: 'PAY-9366',
    shopName: 'Kho Tư Liệu Huế',
    owner: 'Võ Nhật Nam',
    amount: 500000,
    method: 'VNPay',
    submittedAt: '27/10/2025 10:55',
    status: 'escalated',
  },
  {
    id: 'PAY-9351',
    shopName: 'Ký Ức Đông Dương',
    owner: 'Nguyễn Quốc Đạt',
    amount: 500000,
    method: 'VNPay',
    submittedAt: '26/10/2025 11:18',
    status: 'completed',
  },
];

const systemActivity: SystemActivityItem[] = [
  {
    time: '10:24',
    actor: 'Admin Hoa',
    action: 'Duyệt shop PRO “Ký Ức Đông Dương”',
    type: 'approve',
  },
  {
    time: '09:55',
    actor: 'Admin Minh',
    action: 'Ghi chú yêu cầu bổ sung chứng từ PAY-9366',
    type: 'note',
  },
  {
    time: '09:18',
    actor: 'Cảnh báo hệ thống',
    action: 'Tăng đột biến truy cập vào diễn đàn lịch sử',
    type: 'warning',
  },
  {
    time: '08:40',
    actor: 'Admin Hoa',
    action: 'Khôi phục tài khoản user-0192',
    type: 'info',
  },
];

const activityStyles: Record<string, string> = {
  approve: 'bg-emerald-100 text-emerald-700',
  note: 'bg-slate-100 text-slate-600',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-sky-100 text-sky-700',
};

const shopPerformance: ShopPerformanceItem[] = [
  {
    id: 'shop-001',
    name: 'Gốm Việt Heritage',
    packageType: 'PRO',
    revenue: 18600000,
    revenueLimit: 30000000,
    orders: 156,
    supportUsed: 6,
  },
  {
    id: 'shop-014',
    name: 'Thủ Công Hội An',
    packageType: 'BASIC',
    revenue: 8200000,
    revenueLimit: 10000000,
    orders: 73,
    supportUsed: 4,
  },
  {
    id: 'shop-027',
    name: 'Metro Craft Studio',
    packageType: 'PRO',
    revenue: 24700000,
    revenueLimit: 30000000,
    orders: 182,
    supportUsed: 9,
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });

  const numberFormatter = new Intl.NumberFormat('vi-VN');

  const today = new Date();
  const formattedDate = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hour = today.getHours();
  const timeGreeting = hour < 12 ? 'buổi sáng' : hour < 18 ? 'buổi chiều' : 'buổi tối';
  const navWorkflows = workflowKeysOrdered.map((workflowKey) => ({
    workflow: adminWorkflows[workflowKey],
    isActive: workflowKey === 'overview',
  }));

  const openWorkflow = (workflowKey: WorkflowKey, focus?: WorkflowFocus) => {
    if (focus) {
      navigate(`/admin-workflow/${workflowKey}`, { state: { focus } });
      return;
    }
    navigate(`/admin-workflow/${workflowKey}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#fff1f5] px-6 py-8 text-slate-900">
      <div className="flex w-full gap-6">
        <aside className="flex w-72 flex-col rounded-3xl bg-white p-6 shadow-xl shadow-indigo-100/50">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Echoes Admin</p>
              <span className="text-xs text-slate-400">Control Center</span>
            </div>
          </div>
          <nav className="space-y-1">
            {navWorkflows.map(({ workflow, isActive }) => (
              <button
                key={workflow.key}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-indigo-200/60'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                onClick={() => openWorkflow(workflow.key)}
              >
                <workflow.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {workflow.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-gradient-to-br from-purple-500/10 via-white to-indigo-500/10 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Bảng điều khiển admin</p>
            <p className="mt-1">Quản lý user, shop, thanh toán và hệ thống hỗ trợ trong một nơi.</p>
            <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-500 shadow-sm shadow-indigo-100 transition hover:shadow-md">
              <LifeBuoy className="h-4 w-4" />
              Trung tâm hỗ trợ
            </button>
          </div>
        </aside>

        <main className="relative flex-1 overflow-hidden rounded-[2.5rem] border border-indigo-50 bg-white/95 shadow-xl shadow-indigo-100/50 backdrop-blur">
          <div className="relative flex h-full flex-col p-8">
            <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-8 text-white shadow-lg shadow-indigo-200/60">
              <div className="relative flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">Bảng điều khiển</p>
                  <h1 className="mt-3 text-3xl font-semibold">Xin chào, Admin Hoa</h1>
                  <p className="mt-2 text-sm text-white/80">Hôm nay là {formattedDate}. Chúc bạn một {timeGreeting} hiệu quả!</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                    <Search className="h-4 w-4 text-white/70" />
                    <input
                      aria-label="Search admin"
                      placeholder="Tìm người dùng, shop hoặc giao dịch"
                      className="w-56 border-none bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
                    />
                  </div>
                  <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-300" />
                  </button>
                </div>
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-4 text-white">
                  <p className="text-xs uppercase tracking-wider text-white/70">Hôm nay</p>
                  <p className="mt-2 text-xl font-semibold">37 công việc ưu tiên</p>
                  <p className="mt-1 text-xs text-white/70">Bao gồm 3 đơn mở shop và 4 thanh toán</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-white">
                  <p className="text-xs uppercase tracking-wider text-white/70">Truy cập</p>
                  <p className="mt-2 text-xl font-semibold">+126%</p>
                  <p className="mt-1 text-xs text-white/70">Diễn đàn lịch sử tăng mạnh sau sự kiện tối qua</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-white">
                  <p className="text-xs uppercase tracking-wider text-white/70">Hỗ trợ khách</p>
                  <p className="mt-2 text-xl font-semibold">12 ticket đang xử lý</p>
                  <p className="mt-1 text-xs text-white/70">Đừng quên đánh dấu hoàn thành sau khi phản hồi</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-white">
                  <p className="text-xs uppercase tracking-wider text-white/70">Sự kiện</p>
                  <p className="mt-2 text-xl font-semibold">Lịch review 14:30</p>
                  <p className="mt-1 text-xs text-white/70">Đánh giá 2 shop PRO và cập nhật chính sách phí</p>
                </div>
              </div>
            </header>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <button
                  type="button"
                  key={card.title}
                  onClick={() => openWorkflow(card.targetWorkflow, { type: 'stat', data: card })}
                  className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-20`} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">{card.title}</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                      <p className="mt-2 text-xs font-medium text-emerald-600">{card.change}</p>
                    </div>
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg shadow-indigo-200/60`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              ))}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => openWorkflow(action.targetWorkflow, { type: 'quickAction', data: action })}
                  className={`flex items-start gap-4 rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${action.accent}`}
                >
                  <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-current">
                    <action.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                  </span>
                </button>
              ))}
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[2fr,1fr]">
              <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Đơn mở shop cần xử lý</h2>
                    <p className="text-xs text-slate-500">Theo dõi tiến độ, trạng thái thanh toán và số sao của ứng viên</p>
                  </div>
                  <button className="text-sm font-semibold text-indigo-500 hover:text-indigo-600">Xem tất cả</button>
                </div>
                <table className="min-w-full table-fixed divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Shop</th>
                      <th className="px-3 py-3 text-left font-semibold">Gói</th>
                      <th className="px-3 py-3 text-left font-semibold">Sao</th>
                      <th className="px-3 py-3 text-left font-semibold">Thanh toán</th>
                      <th className="px-3 py-3 text-left font-semibold">Trạng thái</th>
                      <th className="px-3 py-3 text-left font-semibold">Nộp lúc</th>
                      <th className="px-6 py-3 text-right font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shopRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="cursor-pointer transition hover:bg-indigo-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                        onClick={() => openWorkflow('shops', { type: 'shopRequest', data: request })}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openWorkflow('shops', { type: 'shopRequest', data: request });
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{request.shopName}</span>
                            <span className="text-xs text-slate-500">{request.owner}</span>
                            <span className="text-xs text-slate-400">{request.email} · {request.phone}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs font-semibold text-slate-600">{request.packageType}</td>
                        <td className="px-3 py-4 text-xs text-slate-500">{request.stars}</td>
                        <td className="px-3 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${paymentStatusStyles[request.paymentStatus]}`}>
                            {paymentStatusLabels[request.paymentStatus] ?? request.paymentStatus}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${requestStatusStyles[request.status]}`}>
                            {requestStatusLabels[request.status] ?? request.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-xs text-slate-500">{request.submittedAt}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">Xem hồ sơ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Cảnh báo & tài khoản cần chú ý</h2>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">{userAlerts.length} cảnh báo</span>
                </div>
                <div className="mt-4 space-y-4">
                  {userAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-2xl border px-4 py-4 transition ${alertSeverityStyles[alert.severity]} hover:-translate-y-0.5 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
                      role="button"
                      tabIndex={0}
                      onClick={() => openWorkflow('users', { type: 'userAlert', data: alert })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openWorkflow('users', { type: 'userAlert', data: alert });
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{alert.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{alert.issue}</p>
                          <p className="mt-2 text-[11px] text-slate-400">Cập nhật: {alert.lastAction}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
                          {alert.stars} sao
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2 text-xs">
                        <button className="inline-flex items-center justify-center rounded-full bg-white px-3 py-2 font-semibold text-indigo-500 shadow-sm shadow-indigo-100 transition hover:bg-indigo-50">
                          Ghi chú xử lý
                        </button>
                        <button className="inline-flex items-center justify-center rounded-full border border-white/60 px-3 py-2 font-semibold text-slate-600 transition hover:border-slate-200 hover:text-slate-800">
                          Xem lịch sử
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr,1fr]">
              <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Hàng đợi đối soát thanh toán</h2>
                    <p className="text-xs text-slate-500">Theo dõi các khoản đặt cọc và chuyển khoản cần xác thực</p>
                  </div>
                  <button className="text-sm font-semibold text-indigo-500 hover:text-indigo-600">Xuất báo cáo</button>
                </div>
                <table className="min-w-full table-fixed divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Thanh toán</th>
                      <th className="px-3 py-3 text-left font-semibold">Số tiền</th>
                      <th className="px-3 py-3 text-left font-semibold">Phương thức</th>
                      <th className="px-3 py-3 text-left font-semibold">Trạng thái</th>
                      <th className="px-3 py-3 text-left font-semibold">Nộp lúc</th>
                      <th className="px-6 py-3 text-right font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentQueue.map((payment) => (
                      <tr
                        key={payment.id}
                        className="cursor-pointer transition hover:bg-indigo-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                        onClick={() => openWorkflow('payments', { type: 'payment', data: payment })}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openWorkflow('payments', { type: 'payment', data: payment });
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{payment.shopName}</span>
                            <span className="text-xs text-slate-500">{payment.owner}</span>
                            <span className="text-[11px] text-slate-400">Mã thanh toán: {payment.id}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs font-semibold text-slate-600">
                          {currencyFormatter.format(payment.amount)}
                        </td>
                        <td className="px-3 py-4 text-xs text-slate-500">{payment.method}</td>
                        <td className="px-3 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${paymentStatusStyles[payment.status]}`}>
                            {paymentStatusLabels[payment.status] ?? payment.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-xs text-slate-500">{payment.submittedAt}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">Xem chứng từ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Nhật ký hệ thống</h2>
                <div className="mt-4 space-y-4">
                  {systemActivity.map((activity, index) => (
                    <button
                      key={`${activity.time}-${index}`}
                      type="button"
                      onClick={() => openWorkflow('overview', { type: 'systemActivity', data: activity })}
                      className="group relative w-full rounded-2xl border border-slate-100 bg-white/60 p-4 pl-6 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    >
                      <span className="absolute left-2 top-5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                      <p className="text-xs font-semibold text-slate-400">{activity.time}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{activity.actor}</p>
                      <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${activityStyles[activity.type]}`}>
                        {activity.action}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Hiệu suất các shop nổi bật</h2>
                  <p className="text-xs text-slate-500">Theo dõi doanh thu, giới hạn gói và số đơn đã xử lý</p>
                </div>
                <button className="text-sm font-semibold text-indigo-500 hover:text-indigo-600">Quản lý tất cả shop</button>
              </div>
              <div className="mt-5 space-y-4">
                {shopPerformance.map((shop) => {
                  const percentage = Math.min(Math.round((shop.revenue / shop.revenueLimit) * 100), 100);

                  return (
                    <button
                      type="button"
                      key={shop.id}
                      onClick={() => openWorkflow('analytics', { type: 'shopPerformance', data: shop })}
                      className="w-full rounded-3xl border border-slate-100 bg-slate-50/60 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{shop.name}</p>
                          <p className="text-xs text-slate-500">Gói {shop.packageType} · {numberFormatter.format(shop.orders)} đơn</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                          {currencyFormatter.format(shop.revenue)} / {currencyFormatter.format(shop.revenueLimit)}
                        </span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>Đã dùng {percentage}% hạn mức doanh thu</span>
                        <span>{shop.supportUsed} lần hỗ trợ vận chuyển</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
