import { useMemo, useRef, useState } from 'react';
import type { HistoryEvent } from '../../data/history';

const ITEM_HEIGHT = 196;
const WINDOW_COUNT = 8;
const OVERSCAN = 3;

type Props = {
  events: HistoryEvent[];
  activeEventId: string | null;
  completedMap: Record<string, boolean>;
  onSelect: (eventId: string) => void;
  variant?: 'interactive' | 'preview';
};

export function Timeline({ events, activeEventId, completedMap, onSelect, variant = 'interactive' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = events.length * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(events.length, startIndex + WINDOW_COUNT + OVERSCAN * 2);

  const visibleItems = useMemo(() => {
    return events.slice(startIndex, endIndex).map((event, idx) => {
      const absoluteIndex = startIndex + idx;
      const top = absoluteIndex * ITEM_HEIGHT;
      const isActive = variant === 'interactive' && event.id === activeEventId;
      const completed = completedMap[event.id];
      const alignment = absoluteIndex % 2 === 0 ? 'left' : 'right';
      const alignWrapper = alignment === 'left' ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16';
      const cardOffset = alignment === 'left' ? 'md:ml-auto' : 'md:mr-auto';
  const tagList = (event.tags ?? []).slice(0, 3);
      return (
        <div key={event.id} className="absolute inset-x-0" style={{ top }}>
          <div className={`relative flex flex-col md:flex-row ${alignWrapper}`}>
            <div className={`relative w-full max-w-xl pl-16 md:pl-0 ${cardOffset}`}>
              <span
                aria-hidden
                className="pointer-events-none absolute left-6 top-7 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-brand-blue bg-white md:left-1/2 md:-translate-x-1/2"
              />
              <button
                type="button"
                onClick={() => onSelect(event.id)}
                className={`relative w-full rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                  isActive ? 'border-brand-blue bg-brand-blue/10 shadow-md' : 'border-brand-blue/20 hover:border-brand-blue/60 hover:shadow-md'
                }`}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-widest text-brand-blue">{event.year}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      completed ? 'bg-green-600 text-white' : 'bg-brand-blue/10 text-brand-blue'
                    }`}
                    aria-label={completed ? 'Bạn đã hoàn thành mốc này' : 'Mốc chưa hoàn thành'}
                  >
                    {completed ? 'Đã hoàn thành' : 'Đang mở'}
                  </span>
                </div>
                <h4 className="mt-2 text-lg font-serif text-brand-text">{event.title}</h4>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{event.summary}</p>
                {tagList.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tagList.map((tag) => (
                      <span key={tag} className="rounded-full bg-brand-blue/10 px-3 py-1 text-[11px] font-semibold text-brand-blue">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {variant === 'preview' && (
                  <p className="mt-3 text-sm font-semibold text-brand-blue">
                    Đăng nhập để mở khóa nội dung đầy đủ & quiz tương tác.
                  </p>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    });
  }, [events, startIndex, endIndex, activeEventId, completedMap, variant]);

  return (
    <div
      ref={containerRef}
      className="relative max-h-[70vh] overflow-y-auto rounded-3xl border border-brand-blue/20 bg-brand-sand/40 px-2"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      aria-label="Dòng thời gian sự kiện"
    >
      <div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-brand-blue/20 md:left-1/2" aria-hidden />
      <div style={{ height: totalHeight, position: 'relative' }}>{visibleItems}</div>
    </div>
  );
}

export default Timeline;
