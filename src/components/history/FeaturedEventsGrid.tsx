import type { HistoryEvent } from '../../data/history';

type Props = {
  events: HistoryEvent[];
  onSelect: (event: HistoryEvent) => void;
};

export function FeaturedEventsGrid({ events, onSelect }: Props) {
  return (
    <section aria-label="Sự kiện tiêu biểu" className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <article
          key={event.id}
          className="group flex h-full flex-col overflow-hidden border border-brand-blue/20 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <button
            type="button"
            onClick={() => onSelect(event)}
            className="text-left"
            aria-label={`Xem tóm tắt sự kiện ${event.title}`}
          >
            {(() => {
              const fallbackSubMedia = event.subEvents.find((item) => item.media?.length)?.media?.[0];
              const coverUrl =
                event.featuredImage?.url ?? event.media?.[0]?.src ?? fallbackSubMedia?.src ?? 'https://images.unsplash.com/photo-1549194383-167c33df3394?auto=format&fit=crop&w=1200&q=80';
              const coverAlt = event.featuredImage?.alt ?? event.media?.[0]?.alt ?? fallbackSubMedia?.alt ?? event.title;
              return (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={coverUrl}
                    alt={coverAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              );
            })()}
            <div className="flex flex-1 flex-col gap-2 px-4 py-5">
              <span className="text-xs uppercase tracking-widest text-brand-blue">{event.year}</span>
              <h3 className="text-lg font-serif text-brand-text">{event.title}</h3>
              <p className="text-sm text-brand-muted">{event.summary.slice(0, 140)}{event.summary.length > 140 ? '…' : ''}</p>
            </div>
          </button>
        </article>
      ))}
    </section>
  );
}

export default FeaturedEventsGrid;
