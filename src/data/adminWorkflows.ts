import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  PieChart,
  LifeBuoy,
  Settings,
} from 'lucide-react';

export type WorkflowKey =
  | 'overview'
  | 'users'
  | 'shops'
  | 'orders'
  | 'payments'
  | 'content'
  | 'analytics'
  | 'support'
  | 'settings';

export type WorkflowAction = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

export type WorkflowDefinition = {
  key: WorkflowKey;
  label: string;
  description: string;
  highlights: string[];
  operations: WorkflowAction[];
  icon: LucideIcon;
  accent: string;
};

export const adminWorkflows: Record<WorkflowKey, WorkflowDefinition> = {
  overview: {
    key: 'overview',
    label: 'Tổng quan',
    description: 'Theo dõi nhịp độ vận hành tổng thể, trạng thái dịch vụ và độ ưu tiên công việc.',
    highlights: ['KPIs thời gian thực', 'Cảnh báo hệ thống', 'Chiến dịch đang chạy'],
    operations: [
      { label: 'Mở báo cáo điều hành', variant: 'primary' },
      { label: 'Xuất dữ liệu KPI', variant: 'secondary' },
      { label: 'Thiết lập cảnh báo' },
    ],
    icon: LayoutDashboard,
    accent: 'from-indigo-500 via-purple-500 to-blue-500',
  },
  users: {
    key: 'users',
    label: 'Người dùng',
    description: 'Quản lý hồ sơ, phân quyền, xác minh và các tình huống escalated của người dùng.',
    highlights: ['Tài khoản mới', 'Tỷ lệ giữ chân', 'Case vi phạm nổi bật'],
    operations: [
      { label: 'Mở danh sách người dùng', variant: 'primary' },
      { label: 'Phân bổ nhân sự xử lý', variant: 'secondary' },
      { label: 'Xuất log hoạt động' },
    ],
    icon: Users,
    accent: 'from-blue-500 via-indigo-500 to-purple-500',
  },
  shops: {
    key: 'shops',
    label: 'Shop & đơn mở shop',
    description: 'Theo dõi vòng đời duyệt shop, trạng thái thanh toán và huấn luyện chủ shop.',
    highlights: ['Đơn chờ duyệt', 'Shop cần hỗ trợ', 'Tài liệu thiếu chứng từ'],
    operations: [
      { label: 'Duyệt/treo đơn mở shop', variant: 'primary' },
      { label: 'Gửi email bổ sung', variant: 'secondary' },
      { label: 'Xem lịch sử làm việc' },
    ],
    icon: Store,
    accent: 'from-emerald-400 via-green-500 to-lime-500',
  },
  orders: {
    key: 'orders',
    label: 'Đơn hàng',
    description: 'Giám sát đơn hàng đang xử lý, khiếu nại và khả năng đáp ứng kho vận.',
    highlights: ['Đơn trễ SLA', 'Khiếu nại nóng', 'Đơn giá trị cao'],
    operations: [
      { label: 'Mở bảng điều phối', variant: 'primary' },
      { label: 'Đặt cảnh báo SLA', variant: 'secondary' },
      { label: 'Xuất báo cáo giao nhận' },
    ],
    icon: ShoppingBag,
    accent: 'from-orange-400 via-amber-400 to-rose-400',
  },
  payments: {
    key: 'payments',
    label: 'Thanh toán',
    description: 'Đối soát giao dịch, theo dõi tiền cọc và xử lý các khoản bất thường.',
    highlights: ['Đối soát theo ca', 'Chứng từ thiếu', 'Khoản escalate'],
    operations: [
      { label: 'Mở phiên đối soát', variant: 'primary' },
      { label: 'Gửi nhắc chứng từ', variant: 'secondary' },
      { label: 'Tạo biên bản bất thường' },
    ],
    icon: CreditCard,
    accent: 'from-teal-400 via-cyan-500 to-sky-500',
  },
  content: {
    key: 'content',
    label: 'Nội dung & diễn đàn',
    description: 'Moderate nội dung, phản hồi báo cáo và kích hoạt chiến dịch cộng đồng.',
    highlights: ['Bài bị báo cáo', 'Xu hướng thảo luận', 'Chiến dịch đang live'],
    operations: [
      { label: 'Mở hàng đợi moderation', variant: 'primary' },
      { label: 'Lên lịch thông báo', variant: 'secondary' },
      { label: 'Xem dữ liệu sentiment' },
    ],
    icon: MessageSquare,
    accent: 'from-violet-500 via-purple-500 to-pink-500',
  },
  analytics: {
    key: 'analytics',
    label: 'Báo cáo & phân tích',
    description: 'Tổng hợp dữ liệu kinh doanh, theo dõi xu hướng và kế hoạch tăng trưởng.',
    highlights: ['Dashboard doanh thu', 'Hiệu quả chiến dịch', 'Dự báo tồn kho'],
    operations: [
      { label: 'Mở studio phân tích', variant: 'primary' },
      { label: 'Xuất dữ liệu raw', variant: 'secondary' },
      { label: 'Gửi báo cáo lịch biểu' },
    ],
    icon: PieChart,
    accent: 'from-fuchsia-500 via-purple-500 to-rose-500',
  },
  support: {
    key: 'support',
    label: 'Hỗ trợ',
    description: 'Điều phối ticket, SLA phản hồi và kế hoạch chăm sóc khách hàng.',
    highlights: ['Ticket vượt SLA', 'Phân bổ nhân sự', 'FAQ cập nhật'],
    operations: [
      { label: 'Mở trung tâm hỗ trợ', variant: 'primary' },
      { label: 'Phân ca trực', variant: 'secondary' },
      { label: 'Tổng hợp insight khách' },
    ],
    icon: LifeBuoy,
    accent: 'from-sky-400 via-blue-500 to-indigo-500',
  },
  settings: {
    key: 'settings',
    label: 'Cài đặt',
    description: 'Cấu hình hệ thống, phân quyền và quy trình vận hành liên phòng ban.',
    highlights: ['Phân quyền nhóm', 'Workflow phê duyệt', 'Tích hợp bên thứ ba'],
    operations: [
      { label: 'Tùy chỉnh phân quyền', variant: 'primary' },
      { label: 'Quản lý webhook', variant: 'secondary' },
      { label: 'Theo dõi lịch sử thay đổi' },
    ],
    icon: Settings,
    accent: 'from-slate-500 via-gray-500 to-slate-400',
  },
};

export const workflowKeysOrdered: WorkflowKey[] = [
  'overview',
  'users',
  'shops',
  'orders',
  'payments',
  'content',
  'analytics',
  'support',
  'settings',
];
