import type { Era, HistoryEvent } from '../../data/history';

type Props = {
  era: Era | null;
  events: HistoryEvent[];
};

export function EraKnowledgeHighlights({ era, events }: Props) {
  if (!era || !events.length) return null;

  const years = events.map((event) => event.year).sort((a, b) => a - b);
  const minYear = years[0];
  const maxYear = years[years.length - 1];
  const uniqueTags = Array.from(new Set(events.flatMap((event) => event.tags ?? []))).slice(0, 8);
  const mediaCount = events.reduce((count, event) => {
    const eventMedia = event.media?.length ?? 0;
    const subEventMedia = event.subEvents.reduce((acc, sub) => acc + (sub.media?.length ?? 0), 0);
    return count + eventMedia + subEventMedia;
  }, 0);

  return (
    <section
      aria-label="Tổng quan kiến thức giai đoạn"
      className="mt-6 rounded-3xl border border-brand-blue/20 bg-white/80 p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-brand-blue/10 p-4 text-brand-text">
          <p className="text-xs uppercase tracking-widest text-brand-blue">Số mốc tiêu biểu</p>
          <p className="mt-2 text-3xl font-serif">{events.length}</p>
          <p className="mt-1 text-sm text-brand-muted">Từ {minYear} đến {maxYear}</p>
        </div>
        <div className="rounded-2xl bg-brand-blue/5 p-4 text-brand-text">
          <p className="text-xs uppercase tracking-widest text-brand-blue">Chủ đề nổi bật</p>
          <p className="mt-2 text-sm text-brand-text">
            {uniqueTags.length ? uniqueTags.map((tag) => `#${tag}`).join(' • ') : 'Đang cập nhật'}
          </p>
        </div>
        <div className="rounded-2xl bg-brand-blue/10 p-4 text-brand-text">
          <p className="text-xs uppercase tracking-widest text-brand-blue">Tư liệu minh hoạ</p>
          <p className="mt-2 text-3xl font-serif">{mediaCount}</p>
          <p className="mt-1 text-sm text-brand-muted">Ảnh, video, tài liệu sưu tầm</p>
        </div>
        <div className="rounded-2xl bg-brand-blue/5 p-4 text-brand-text">
          <p className="text-xs uppercase tracking-widest text-brand-blue">Mô tả giai đoạn</p>
          <p className="mt-2 text-sm leading-6 text-brand-text">{era.description}</p>
        </div>
      </div>
    </section>
  );
}

export default EraKnowledgeHighlights;
