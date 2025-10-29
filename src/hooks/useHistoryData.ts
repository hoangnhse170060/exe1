import { useEffect, useMemo, useState } from 'react';
import { fetchEras, fetchEventsByEra, fetchQuizByEvent, type Era, type HistoryEvent, type QuizQuestion } from '../data/history';

const eventCache = new Map<string, HistoryEvent[]>();
const quizCache = new Map<string, QuizQuestion[]>();
let eraCache: Era[] | null = null;

export type HistoryDataState = {
  eras: Era[];
  events: HistoryEvent[];
  featuredEvents: HistoryEvent[];
  loading: boolean;
  error: string | null;
  quizzes: Record<string, QuizQuestion[]>;
  refresh: () => void;
};

/**
 * Load history content for a specific era. Results are memoised per era to avoid duplicate fetches.
 */
export function useHistoryData(eraId: Era['id']): HistoryDataState {
  const [eras, setEras] = useState<Era[]>(() => eraCache ?? []);
  const [events, setEvents] = useState<HistoryEvent[]>(() => eventCache.get(eraId) ?? []);
  const [loading, setLoading] = useState<boolean>(!eventCache.has(eraId));
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function hydrateEras() {
      try {
        if (eraCache) {
          setEras(eraCache);
          return;
        }
        const result = await fetchEras();
        if (!cancelled) {
          eraCache = result;
          setEras(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Không thể tải danh sách giai đoạn.');
        }
      }
    }
    void hydrateEras();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(!eventCache.has(eraId));
    setError(null);
    async function hydrateEvents() {
      try {
        const result = await fetchEventsByEra(eraId);
        if (cancelled) return;
        eventCache.set(eraId, result);
        setEvents(result);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError('Không thể tải sự kiện lịch sử.');
        setLoading(false);
      }
    }
    void hydrateEvents();
    return () => {
      cancelled = true;
    };
  }, [eraId, refreshIndex]);

  const quizzes = useMemo(() => {
    const map: Record<string, QuizQuestion[]> = {};
    (eventCache.get(eraId) ?? []).forEach((event) => {
      const cached = quizCache.get(event.id);
      if (cached) {
        map[event.id] = cached;
      }
    });
    return map;
  }, [eraId, refreshIndex]);

  const featuredEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => a.year - b.year)
      .slice(0, 6);
  }, [events]);

  const refresh = () => setRefreshIndex((prev) => prev + 1);

  const preloadQuiz = async (eventId: string) => {
    if (quizCache.has(eventId)) return quizCache.get(eventId)!;
    const data = await fetchQuizByEvent(eventId);
    quizCache.set(eventId, data);
    return data;
  };

  useEffect(() => {
    if (!events.length) return;
    events.forEach((event) => {
      if (!quizCache.has(event.id)) {
        void preloadQuiz(event.id);
      }
    });
  }, [events]);

  return {
    eras,
    events,
    featuredEvents,
    loading,
    error,
    quizzes,
    refresh,
  };
}
