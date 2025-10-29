import { useEffect, useMemo } from 'react';
import type { ContentBlock, HistoryEvent, MediaItem, SubEvent } from '../../data/history';
import { useReadProgress } from '../../hooks/useReadProgress';

type Props = {
  event: HistoryEvent | null;
  storedProgress: number;
  onProgressChange: (ratio: number) => void;
  isCompleted: boolean;
  quizLauncher?: React.ReactNode;
  bestScore?: number;
  bestStars?: number;
};

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'long',
});

function isMediaBlock(block: ContentBlock): block is MediaItem & { secId: string } {
  return Object.prototype.hasOwnProperty.call(block, 'kind');
}

function renderContentBlock(block: ContentBlock) {
  if (isMediaBlock(block)) {
    if (block.kind === 'image') {
      return (
        <figure key={block.secId} className="space-y-2">
          <img src={block.src} alt={block.alt} loading="lazy" className="w-full rounded-xl object-cover" />
          {(block.caption || block.credit) && (
            <figcaption className="text-sm text-brand-muted">
              {block.caption}
              {block.credit && <span className="ml-2 text-xs uppercase text-brand-muted/80">Nguồn: {block.credit}</span>}
            </figcaption>
          )}
        </figure>
      );
    }
    if (block.kind === 'video') {
      return (
        <figure key={block.secId} className="space-y-2">
          <video controls preload="metadata" className="w-full rounded-xl">
            <source src={block.src} />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
          {(block.caption || block.credit) && (
            <figcaption className="text-sm text-brand-muted">
              {block.caption}
              {block.credit && <span className="ml-2 text-xs uppercase text-brand-muted/80">Nguồn: {block.credit}</span>}
            </figcaption>
          )}
        </figure>
      );
    }
    if (block.kind === 'document') {
      return (
        <div key={block.secId} className="rounded-lg border border-brand-blue/30 bg-brand-sand/30 p-4 text-sm">
          <p className="font-semibold text-brand-text">{block.caption ?? 'Tư liệu lưu trữ'}</p>
          <a
            href={block.src}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center text-sm font-semibold text-brand-blue hover:underline"
          >
            Mở tư liệu (nguồn: {block.credit || 'đang cập nhật'})
          </a>
        </div>
      );
    }
    return null;
  }

  switch (block.type) {
    case 'h2':
      return (
        <h3 key={block.secId} className="text-2xl font-serif text-brand-text">
          {block.text}
        </h3>
      );
    case 'h3':
      return (
        <h4 key={block.secId} className="text-xl font-semibold text-brand-text">
          {block.text}
        </h4>
      );
    case 'quote':
      return (
        <figure key={block.secId} className="border-l-4 border-brand-blue/60 bg-brand-blue/5 p-4 italic text-brand-text">
          <blockquote>“{block.text}”</blockquote>
          {block.source && <figcaption className="mt-2 text-sm text-brand-muted">— {block.source}</figcaption>}
        </figure>
      );
    case 'p':
    default:
      return (
        <p key={block.secId} className="text-brand-text">
          {block.text}
        </p>
      );
  }
}

function renderSubEvent(subEvent: SubEvent) {
  const formattedDate = subEvent.date ? dateFormatter.format(new Date(subEvent.date)) : null;
  const hasMedia = (subEvent.media?.length ?? 0) > 0;
  return (
    <article key={subEvent.id} className="rounded-2xl border border-brand-blue/15 bg-white/80 p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {formattedDate && <p className="text-xs uppercase tracking-widest text-brand-blue">{formattedDate}</p>}
          <h3 className="mt-1 text-xl font-serif text-brand-text">{subEvent.title}</h3>
        </div>
        <div className="flex flex-col items-end text-xs text-brand-muted">
          {subEvent.leader && <span>Chỉ huy: {subEvent.leader}</span>}
          {subEvent.opponent && <span>Đối phương: {subEvent.opponent}</span>}
        </div>
      </header>

      <p className="mt-3 text-sm text-brand-muted">{subEvent.guestSummary}</p>

      {subEvent.troopEstimates && (
        <div className="mt-4 grid gap-3 rounded-xl bg-brand-blue/5 p-4 text-sm text-brand-text md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase text-brand-blue">Lực lượng ta</p>
            <p className="mt-1 leading-6">{subEvent.troopEstimates.us ?? 'Đang cập nhật'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-brand-blue">Lực lượng địch</p>
            <p className="mt-1 leading-6">{subEvent.troopEstimates.them ?? 'Đang cập nhật'}</p>
          </div>
          {subEvent.troopEstimates.note && (
            <div>
              <p className="text-xs font-semibold uppercase text-brand-blue">Ghi chú</p>
              <p className="mt-1 leading-6">{subEvent.troopEstimates.note}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 space-y-4 text-base leading-7 text-brand-text">
        {subEvent.content.map((block) => renderContentBlock(block))}
      </div>

      {hasMedia && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {subEvent.media?.map((media) => (
            <figure key={media.src} className="space-y-2">
              {media.kind === 'image' && (
                <img src={media.src} alt={media.alt} loading="lazy" className="w-full rounded-xl object-cover" />
              )}
              {media.kind === 'video' && (
                <video controls preload="metadata" className="w-full rounded-xl">
                  <source src={media.src} />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              )}
              {(media.caption || media.credit) && (
                <figcaption className="text-sm text-brand-muted">
                  {media.caption}
                  {media.credit && <span className="ml-2 text-xs uppercase text-brand-muted/80">Nguồn: {media.credit}</span>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {subEvent.sources?.length ? (
        <ul className="mt-4 space-y-1 text-sm text-brand-muted">
          {subEvent.sources.map((source) => (
            <li key={source.title} className="list-disc pl-4">
              {source.link ? (
                <a href={source.link} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
                  {source.title}
                </a>
              ) : (
                source.title
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function EventDetail({
  event,
  storedProgress,
  onProgressChange,
  isCompleted,
  quizLauncher,
  bestScore,
  bestStars,
}: Props) {
  const { ref, progress } = useReadProgress<HTMLDivElement>({
    threshold: 0.8,
    onThreshold: () => {
      onProgressChange(0.8);
    },
  });

  useEffect(() => {
    if (progress > storedProgress) {
      onProgressChange(progress);
    }
  }, [progress, storedProgress, onProgressChange]);

  const subEventOrder = useMemo(() => {
    if (!event) return [];
    return [...event.subEvents].sort((a, b) => a.order - b.order);
  }, [event]);

  if (!event) {
    return (
      <section className="min-h-[60vh] rounded-2xl border border-dashed border-brand-blue/30 bg-white/70 p-8 text-center text-brand-muted">
        Chọn một mốc trong dòng thời gian để xem nội dung chi tiết.
      </section>
    );
  }

  const statusLabel = isCompleted ? 'Đã hoàn thành' : `Đã đọc ${(Math.max(progress, storedProgress) * 100).toFixed(0)}%`;
  const formattedDate = event.date ? dateFormatter.format(new Date(event.date)) : undefined;

  return (
    <article
      ref={ref}
      className="relative flex flex-col gap-6 rounded-2xl border border-brand-blue/20 bg-white/95 p-6 shadow-sm"
      aria-live="polite"
    >
      <header>
        <p className="text-xs uppercase tracking-widest text-brand-blue">{event.year}</p>
        <h2 className="mt-2 text-3xl font-serif text-brand-text">{event.title}</h2>
        {formattedDate && <p className="mt-1 text-sm text-brand-muted">{formattedDate}</p>}
        <p className="mt-2 text-base text-brand-muted">{event.headline ?? event.summary}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          <span aria-live="polite" aria-atomic="true">{statusLabel}</span>
          {typeof bestScore === 'number' && (
            <span className="text-brand-text/80">• Kết quả cao nhất: {bestScore}%</span>
          )}
          {typeof bestStars === 'number' && bestStars > 0 && <span className="text-amber-600">★ {bestStars}</span>}
        </div>
      </header>

      {event.featuredImage && (
        <figure className="overflow-hidden rounded-2xl">
          <img
            src={event.featuredImage.url}
            alt={event.featuredImage.alt}
            loading="lazy"
            className="w-full rounded-2xl object-cover"
          />
          {event.featuredImage.credit && (
            <figcaption className="mt-2 text-xs uppercase text-brand-muted">
              Nguồn: {event.featuredImage.credit}
            </figcaption>
          )}
        </figure>
      )}

      <section className="space-y-5 text-base leading-7 text-brand-text">
        {event.content.map((block) => renderContentBlock(block))}
      </section>

      <section className="space-y-5" aria-label="Các chặng diễn biến">
        <h3 className="text-2xl font-serif text-brand-text">Diễn biến chính</h3>
        <div className="space-y-4">
          {subEventOrder.map((item) => renderSubEvent(item))}
        </div>
      </section>

      {quizLauncher && (
        <footer className="mt-6 border-t border-dashed border-brand-blue/30 pt-4">
          {quizLauncher}
        </footer>
      )}
    </article>
  );
}

export default EventDetail;
