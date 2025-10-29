import { useMemo } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronLeft,
  ClipboardList,
  ExternalLink,
} from 'lucide-react';
import { adminWorkflows } from '../data/adminWorkflows';
import type { WorkflowDefinition, WorkflowKey, WorkflowAction } from '../data/adminWorkflows';
import type { WorkflowFocus } from '../types/adminDashboard';

const requestStatusLabels: Record<string, string> = {
  pending: 'Chờ kiểm tra',
  inReview: 'Đang xem xét',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

const paymentStatusLabels: Record<string, string> = {
  waiting: 'Chờ chuyển khoản',
  verifying: 'Đang đối soát',
  verified: 'Đã xác nhận',
  missing: 'Thiếu chứng từ',
  escalated: 'Cần can thiệp',
  completed: 'Hoàn tất',
};

const alertSeverityLabels: Record<string, string> = {
  info: 'Thông tin',
  warning: 'Cần theo dõi',
  critical: 'Cảnh báo nghiêm trọng',
};

const isWorkflowKey = (value: string): value is WorkflowKey => value in adminWorkflows;

const renderActionVariant = (action: WorkflowAction) => {
  if (action.variant === 'primary') {
    return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-indigo-200/60 hover:shadow-xl';
  }
  if (action.variant === 'secondary') {
    return 'border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100';
  }
  if (action.variant === 'danger') {
    return 'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100';
  }
  return 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100';
};

const AdminWorkflow = () => {
  const params = useParams<{ workflowKey?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const focus = (location.state as { focus?: WorkflowFocus } | undefined)?.focus;

  if (!params.workflowKey || !isWorkflowKey(params.workflowKey)) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  const workflowKey = params.workflowKey;
  const workflow: WorkflowDefinition = adminWorkflows[workflowKey];
  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });
  const numberFormatter = new Intl.NumberFormat('vi-VN');

  const focusDetails = useMemo(() => {
    if (!focus) {
      return null;
    }

    switch (focus.type) {
      case 'stat':
        return {
          heading: focus.data.title,
          subtitle: focus.data.value,
          description: focus.data.description,
          bullets: [
            `Biến động: ${focus.data.change}`,
            ...focus.data.operations.map((operation) => `Nhiệm vụ gợi ý: ${operation.label}`),
          ],
          actions: focus.data.operations,
        };
      case 'quickAction':
        return {
          heading: focus.data.label,
          description: focus.data.description,
          bullets: ['Thiết kế cho ca trực hiện tại', 'Đã chuẩn bị checklist kèm tài liệu'],
          actions: focus.data.operations,
        };
      case 'shopRequest': {
        const data = focus.data;
        const actions: WorkflowAction[] = [
          { label: 'Mở hồ sơ chi tiết', variant: 'primary' },
          { label: 'Phê duyệt nhanh', variant: 'secondary' },
          { label: 'Yêu cầu bổ sung chứng từ' },
        ];
        return {
          heading: data.shopName,
          subtitle: `${data.packageType} • ${data.id}`,
          description: 'Hồ sơ đăng ký mở shop đang trong hàng đợi xử lý.',
          bullets: [
            `Trạng thái hồ sơ: ${requestStatusLabels[data.status] ?? data.status}`,
            `Thanh toán: ${paymentStatusLabels[data.paymentStatus] ?? data.paymentStatus}`,
            `Số sao uy tín: ${numberFormatter.format(data.stars)}`,
            `Liên hệ: ${data.owner} · ${data.phone}`,
            `Email: ${data.email}`,
            `Nộp lúc: ${data.submittedAt}`,
          ],
          actions,
        };
      }
      case 'payment': {
        const data = focus.data;
        const actions: WorkflowAction[] = [
          { label: 'Xem chứng từ gốc', variant: 'primary' },
          { label: 'Ghi chú đối soát', variant: 'secondary' },
          { label: 'Escalate cho Finance' },
        ];
        return {
          heading: data.shopName,
          subtitle: `${data.id} • ${data.method}`,
          description: 'Khoản đặt cọc cần đối soát trong ca trực hiện tại.',
          bullets: [
            `Số tiền: ${currencyFormatter.format(data.amount)}`,
            `Trạng thái: ${paymentStatusLabels[data.status] ?? data.status}`,
            `Người gửi: ${data.owner}`,
            `Ghi nhận: ${data.submittedAt}`,
          ],
          actions,
        };
      }
      case 'userAlert': {
        const data = focus.data;
        const actions: WorkflowAction[] = [
          { label: 'Ghi chú xử lý', variant: 'primary' },
          { label: 'Xem lịch sử vi phạm', variant: 'secondary' },
          { label: 'Đặt lịch follow-up' },
        ];
        return {
          heading: data.name,
          subtitle: data.id,
          description: data.issue,
          bullets: [
            `Mức độ: ${alertSeverityLabels[data.severity] ?? 'Thông tin'}`,
            `Điểm uy tín: ${data.stars} sao`,
            `Cập nhật cuối: ${data.lastAction}`,
          ],
          actions,
        };
      }
      case 'systemActivity': {
        const data = focus.data;
        const actions: WorkflowAction[] = [
          { label: 'Xem log chi tiết', variant: 'primary' },
          { label: 'Gắn tag đội ngũ liên quan', variant: 'secondary' },
          { label: 'Tạo nhiệm vụ follow-up' },
        ];
        return {
          heading: data.actor,
          subtitle: `${data.time} • Log hệ thống`,
          description: data.action,
          bullets: ['Log được ghi vào hệ thống giám sát', 'Đảm bảo đồng bộ audit trail'],
          actions,
        };
      }
      case 'shopPerformance': {
        const data = focus.data;
        const limit = currencyFormatter.format(data.revenueLimit);
        const revenue = currencyFormatter.format(data.revenue);
        const actions: WorkflowAction[] = [
          { label: 'Gửi tư vấn tăng trưởng', variant: 'primary' },
          { label: 'Đặt lịch coaching', variant: 'secondary' },
          { label: 'Xem lịch sử tương tác' },
        ];
        return {
          heading: data.name,
          subtitle: `${data.packageType} • ${data.id}`,
          description: 'Hiệu suất shop nổi bật cần theo dõi và hỗ trợ vận hành.',
          bullets: [
            `Doanh thu: ${revenue} / ${limit}`,
            `Đơn đã xử lý: ${numberFormatter.format(data.orders)}`,
            `Lượt hỗ trợ vận chuyển: ${data.supportUsed}`,
          ],
          actions,
        };
      }
      default:
        return null;
    }
  }, [focus, currencyFormatter, numberFormatter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#fff1f5] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-indigo-100/50 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-500 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
                Quay về tổng quan
              </button>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-indigo-200/60">
                <workflow.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Nghiệp vụ admin</p>
                <h1 className="mt-2 text-3xl font-semibold">{workflow.label}</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">{workflow.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <ClipboardList className="h-4 w-4" />
              Bảng điều khiển chính
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {workflow.highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                {highlight}
              </span>
            ))}
          </div>
        </header>

        {focusDetails ? (
          <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            <div className="rounded-3xl border border-indigo-50 bg-white p-7 shadow-lg shadow-indigo-100/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Ngữ cảnh vừa chọn</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{focusDetails.heading}</h2>
              {focusDetails.subtitle ? (
                <p className="mt-1 text-sm font-semibold text-indigo-500">{focusDetails.subtitle}</p>
              ) : null}
              {focusDetails.description ? (
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{focusDetails.description}</p>
              ) : null}
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {focusDetails.bullets.map((bullet, index) => (
                  <li key={`${bullet}-${index}`} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-emerald-50 bg-emerald-50/70 p-7 text-slate-800 shadow-inner shadow-emerald-100/60">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Nghiệp vụ kế tiếp</p>
                <h3 className="mt-3 text-lg font-semibold">Các thao tác nên ưu tiên</h3>
                <p className="mt-2 text-sm text-emerald-700">Chọn nhanh một hành động bên dưới để tiếp tục quy trình.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {focusDetails.actions.map((action, index) => (
                  <button
                    key={`${action.label}-${index}`}
                    type="button"
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${renderActionVariant(action)}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {action.label}
                  </button>
                ))}
              </div>
            </aside>
          </section>
        ) : (
          <section className="rounded-3xl border border-indigo-50 bg-white p-7 shadow-lg shadow-indigo-100/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Gợi ý</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Chọn một card trong dashboard để xem chi tiết nghiệp vụ</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
              Trang này sẽ hiển thị quy trình chi tiết tương ứng với widget bạn vừa chọn. Hãy quay lại dashboard và chọn
              thẻ bạn quan tâm để tiếp tục.
            </p>
          </section>
        )}

        <section className="rounded-3xl border border-slate-100 bg-white p-7 shadow-lg shadow-indigo-100/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nghiệp vụ khả dụng</p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">Thao tác chính cho module {workflow.label.toLowerCase()}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {workflow.operations.map((operation, index) => (
              <button
                key={`${operation.label}-${index}`}
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${renderActionVariant(operation)}`}
              >
                <ExternalLink className="h-4 w-4" />
                {operation.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminWorkflow;
