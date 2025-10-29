import { useEffect, useRef } from 'react';
import type { HistoryEvent } from '../../data/history';

type Props = {
  event: HistoryEvent | null;
  onClose: () => void;
};

export function FeaturedModal({ event, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!event) return;
    const previous = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKey = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        onClose();
      }
      if (evt.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )).filter((node) => !node.hasAttribute('disabled'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (evt.shiftKey && document.activeElement === first) {
          evt.preventDefault();
          last.focus();
        } else if (!evt.shiftKey && document.activeElement === last) {
          evt.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, [event, onClose]);

  if (!event) return null;

  const fallbackSubEventMedia = event.subEvents.find((item) => item.media?.length)?.media?.[0];
  const coverUrl =
    event.featuredImage?.url ?? event.media?.[0]?.src ?? fallbackSubEventMedia?.src ?? 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80';
  const coverAlt = event.featuredImage?.alt ?? event.media?.[0]?.alt ?? fallbackSubEventMedia?.alt ?? event.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/60 px-4" role="dialog" aria-modal="true" aria-labelledby="featured-modal-title">
      <div ref={dialogRef} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-brand-blue bg-white shadow-2xl">
        <div className="relative">
          <img
            src={coverUrl}
            alt={coverAlt}
            loading="lazy"
            className="h-64 w-full object-cover"
          />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-brand-text shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-label="Đóng tóm tắt sự kiện"
          >
            Đóng
          </button>
        </div>
        <div className="space-y-4 px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-blue">{event.year}</p>
            <h2 id="featured-modal-title" className="mt-1 text-2xl font-serif text-brand-text">
              {event.title}
            </h2>
            <p className="mt-2 text-sm text-brand-muted">{event.headline ?? event.summary}</p>
          </div>
          <p className="text-base leading-7 text-brand-text">{event.summary}</p>
          <div className="rounded-lg bg-brand-sand/40 p-4 text-sm text-brand-muted">
            Đăng nhập để xem toàn bộ dòng thời gian, tư liệu chi tiết và làm quiz cho mốc {event.title}.
          </div>
          <div className="flex justify-end gap-3">
            <a
              href={`/login?redirect=/history?era=${event.eraId}&eventId=${event.id}`}
              className="inline-flex items-center rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              Đăng nhập để tiếp tục
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedModal;
