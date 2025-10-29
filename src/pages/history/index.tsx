import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EraChipList from '../../components/history/EraChipList';
import EraKnowledgeHighlights from '../../components/history/EraKnowledgeHighlights';
import FeaturedModal from '../../components/history/FeaturedModal';
import Timeline from '../../components/history/Timeline';
import EventDetail from '../../components/history/EventDetail';
import QuizLauncher from '../../components/history/Quiz/QuizLauncher';
import QuizRunner, { type QuizAnswerRecord, type QuizSummary } from '../../components/history/Quiz/QuizRunner';
import QuizResult from '../../components/history/Quiz/QuizResult';
import { useHistoryData } from '../../hooks/useHistoryData';
import { getActiveUser, type AppUser, isAuthenticated } from '../../lib/auth';
import { gradeQuiz, pickQuestions } from '../../lib/quiz';
import {
  getHistoryProgress,
  recordQuizAttempt,
  updateHistoryProgress,
  type HistoryProgress,
} from '../../lib/storage';
import { fetchQuizByEvent, historyData, type Era, type HistoryEvent } from '../../data/history';

export default function HistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const user: AppUser | null = getActiveUser();
  const initialEra = (params.get('era') as Era['id']) || 'french';
  const [selectedEraId, setSelectedEraId] = useState<Era['id']>(initialEra);
  const [activeEventId, setActiveEventId] = useState<string | null>(params.get('eventId'));
  const [featuredModalEvent, setFeaturedModalEvent] = useState<HistoryEvent | null>(null);
  const { eras, events, loading, error } = useHistoryData(selectedEraId);
  const [progressMap, setProgressMap] = useState<Record<string, HistoryProgress>>({});
  const [quizQuestions, setQuizQuestions] = useState([] as ReturnType<typeof pickQuestions>);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAttemptNumber, setQuizAttemptNumber] = useState(1);
  const [reviewAnswers, setReviewAnswers] = useState<QuizAnswerRecord[] | null>(null);
  const [quizOutcome, setQuizOutcome] = useState<{
    score: number;
    stars: number;
    correct: number;
    total: number;
    attemptNumber: number;
  } | null>(null);

  useEffect(() => {
    if (!events.length) return;
    if (!activeEventId) {
      const first = [...events].sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0))[0];
      setActiveEventId(first?.id ?? null);
    }
  }, [events, activeEventId]);

  useEffect(() => {
    if (!user) {
      setProgressMap({});
      return;
    }
    const map: Record<string, HistoryProgress> = {};
    events.forEach((event) => {
      map[event.id] = getHistoryProgress(user.id, event.id);
    });
    setProgressMap(map);
  }, [events, user?.id]);

  useEffect(() => {
    const search = new URLSearchParams();
    search.set('era', selectedEraId);
    if (activeEventId) {
      search.set('eventId', activeEventId);
    }
    navigate({ pathname: '/history', search: search.toString() }, { replace: true });
  }, [selectedEraId, activeEventId, navigate]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((event) => (event.tags ?? []).forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [events]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0));
  }, [events]);

  const activeEvent = sortedEvents.find((event) => event.id === activeEventId) || sortedEvents[0] || null;
  const heroEra = eras.find((era) => era.id === selectedEraId) ?? historyData.eras[0];

  const handleSelectEra = (id: Era['id']) => {
    setSelectedEraId(id);
    setActiveEventId(null);
    setReviewAnswers(null);
  };

  const handleProgressChange = (eventId: string, ratio: number) => {
    if (!user) return;
    const updated = updateHistoryProgress(user.id, eventId, { readRatio: ratio });
    setProgressMap((prev) => ({ ...prev, [eventId]: updated }));
  };

  const openQuiz = async (eventId: string) => {
    if (!user) return;
    const progress = progressMap[eventId];
    const attemptNumber = (progress?.attempts.length ?? 0) + 1;
    setQuizAttemptNumber(attemptNumber);
    const bank = await fetchQuizByEvent(eventId);
    const desired = 5 + Math.floor(Math.random() * 6);
    const questions = pickQuestions(bank, desired);
    setQuizQuestions(questions);
    setShowQuiz(true);
    setReviewAnswers(null);
  };

  const handleQuizComplete = (summary: QuizSummary) => {
    if (!user || !activeEvent) return;
    const correct = summary.correct;
    const total = summary.total;
    const grade = gradeQuiz(correct, total, quizAttemptNumber);
    const attemptRecord = {
      attemptNumber: quizAttemptNumber,
      score: grade.score,
      stars: grade.stars,
      correct,
      total,
      attemptedAt: new Date().toISOString(),
      questionIds: summary.answers.map((record) => record.questionId),
    };
    const updatedProgress = recordQuizAttempt(user.id, activeEvent.id, attemptRecord);
    setProgressMap((prev) => ({ ...prev, [activeEvent.id]: updatedProgress }));
    setReviewAnswers(summary.answers);
    setQuizOutcome({ score: grade.score, stars: grade.stars, correct, total, attemptNumber: quizAttemptNumber });
    setShowQuiz(false);
  };

  const canLaunchQuiz = !!user && !!activeEvent && (progressMap[activeEvent.id]?.readRatio ?? 0) >= 0.8;
  const completedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    Object.entries(progressMap).forEach(([eventId, progress]) => {
      map[eventId] = progress.readRatio >= 0.8;
    });
    return map;
  }, [progressMap]);

  const nextEventId = useMemo(() => {
    if (!activeEvent) return null;
    const index = sortedEvents.findIndex((event) => event.id === activeEvent.id);
    if (index === -1) return null;
    return sortedEvents[index + 1]?.id ?? null;
  }, [sortedEvents, activeEvent]);

  return (
    <div className="min-h-screen bg-brand-base pb-16">
      <header
        className="relative h-72 w-full bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.75)), url(${heroEra.heroImage.url})` }}
      >
        <div className="flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-sm uppercase tracking-[0.5em] text-brand-sand">Ký ức kháng chiến</p>
          <h1 className="mt-3 text-4xl font-serif md:text-6xl">{heroEra.name}</h1>
          <p className="mt-3 max-w-3xl text-base md:text-lg">{heroEra.description}</p>
        </div>
      </header>

      <main className="mx-auto mt-6 w-full max-w-7xl px-4">
        <EraChipList eras={eras} selectedEraId={selectedEraId} onSelect={handleSelectEra} />

        <EraKnowledgeHighlights era={heroEra} events={events} />

        {!isAuthenticated() && (
          <p className="mt-4 rounded-xl border border-brand-blue/20 bg-brand-blue/10 px-4 py-3 text-sm text-brand-blue">
            Đăng nhập để mở khóa dòng thời gian chi tiết, tư liệu đa phương tiện và hệ thống quiz.
          </p>
        )}

        {error && <p className="mt-6 rounded bg-rose-100 p-4 text-sm text-rose-700">{error}</p>}

        {loading ? (
          <div className="mt-10 text-center text-brand-blue">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
          </div>
        ) : null}

        {!user && !loading && (
          <>
            <section className="mt-8">
              <Timeline
                events={sortedEvents}
                activeEventId={null}
                completedMap={{}}
                onSelect={(eventId) => {
                  const event = events.find((item) => item.id === eventId) ?? null;
                  setFeaturedModalEvent(event);
                }}
                variant="preview"
              />
            </section>
            <FeaturedModal event={featuredModalEvent} onClose={() => setFeaturedModalEvent(null)} />
          </>
        )}

        {user && !loading && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-brand-blue/15 bg-white/90 p-4 shadow-sm">
                <p className="text-sm text-brand-text">Chọn mốc trong dòng thời gian để xem chi tiết và mở quiz.</p>
              </div>
              <Timeline
                events={sortedEvents}
                activeEventId={activeEvent?.id ?? null}
                completedMap={completedMap}
                onSelect={(eventId) => {
                  setActiveEventId(eventId);
                  setReviewAnswers(null);
                }}
              />
              {availableTags.length ? (
                <div className="rounded-2xl border border-brand-blue/15 bg-white/70 p-4 text-sm text-brand-muted">
                  <p className="font-semibold text-brand-text">Chủ đề nổi bật</p>
                  <p className="mt-2 text-brand-text">{availableTags.map((tag) => `#${tag}`).join(' · ')}</p>
                </div>
              ) : null}
            </div>
            <div className="space-y-6">
              <EventDetail
                event={activeEvent}
                storedProgress={progressMap[activeEvent?.id ?? '']?.readRatio ?? 0}
                onProgressChange={(ratio) => {
                  if (activeEvent) {
                    handleProgressChange(activeEvent.id, ratio);
                  }
                }}
                isCompleted={completedMap[activeEvent?.id ?? ''] ?? false}
                bestScore={progressMap[activeEvent?.id ?? '']?.bestScore}
                bestStars={progressMap[activeEvent?.id ?? '']?.bestStars}
                quizLauncher={
                  activeEvent ? (
                    <div className="space-y-4">
                      <QuizLauncher
                        canLaunch={canLaunchQuiz}
                        onLaunch={() => activeEvent && openQuiz(activeEvent.id)}
                        attempts={progressMap[activeEvent?.id ?? '']?.attempts.length ?? 0}
                        bestScore={progressMap[activeEvent?.id ?? '']?.bestScore}
                        bestStars={progressMap[activeEvent?.id ?? '']?.bestStars}
                      />
                      {reviewAnswers && (
                        <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 text-sm text-brand-text">
                          <h4 className="text-base font-semibold text-brand-text">Giải thích câu hỏi gần nhất</h4>
                          <ul className="mt-3 space-y-2">
                            {reviewAnswers.map((answer) => {
                              const question = quizQuestions.find((q) => q.id === answer.questionId);
                              if (!question) return null;
                              const selected =
                                typeof answer.selectedIndex === 'number' ? question.options[answer.selectedIndex] : 'Chưa trả lời';
                              const correct = question.options[answer.correctIndex];
                              return (
                                <li key={answer.questionId} className="rounded-lg bg-white/70 p-3 shadow-sm">
                                  <p className="font-semibold text-brand-text">{question.prompt}</p>
                                  <p className="mt-1 text-brand-muted">Bạn chọn: {selected}</p>
                                  <p className="text-brand-blue">Đáp án đúng: {correct}</p>
                                  <p className="mt-1 text-brand-text">{answer.explanation}</p>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null
                }
              />
            </div>
          </section>
        )}
      </main>

      {showQuiz && activeEvent && (
        <QuizRunner
          questions={quizQuestions}
          attemptNumber={quizAttemptNumber}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {quizOutcome && activeEvent && (
        <QuizResult
          score={quizOutcome.score}
          stars={quizOutcome.stars}
          correct={quizOutcome.correct}
          total={quizOutcome.total}
          attemptNumber={quizOutcome.attemptNumber}
          onRetry={() => {
            setQuizOutcome(null);
            openQuiz(activeEvent.id).catch(() => undefined);
          }}
          onReview={() => {
            setQuizOutcome(null);
          }}
          onClose={() => setQuizOutcome(null)}
          nextCta={
            nextEventId
              ? () => {
                  setQuizOutcome(null);
                  setActiveEventId(nextEventId);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
