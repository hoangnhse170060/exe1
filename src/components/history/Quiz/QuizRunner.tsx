import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuizQuestion } from '../../../data/history';
import { useTimer } from '../../../hooks/useTimer';

export type QuizAnswerRecord = {
  questionId: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
};

export type QuizSummary = {
  correct: number;
  total: number;
  answers: QuizAnswerRecord[];
  durationMs: number;
  startedAt: string;
};

type Props = {
  questions: QuizQuestion[];
  attemptNumber: number;
  onClose: () => void;
  onComplete: (summary: QuizSummary) => void;
};

const DEFAULT_TIME_PER_QUESTION = 25000;

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function QuizRunner({ questions, attemptNumber, onClose, onComplete }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState<QuizAnswerRecord[]>(() =>
    questions.map((question) => ({
      questionId: question.id,
      selectedIndex: null,
      correctIndex: question.answerIndex,
      isCorrect: false,
      explanation: question.explanation ?? '',
    })),
  );
  const [revealed, setRevealed] = useState(false);
  const [timerAnnouncement, setTimerAnnouncement] = useState('');
  const startedAt = useRef(new Date().toISOString());

  const totalDuration = useMemo(() => {
    if (!questions.length) return DEFAULT_TIME_PER_QUESTION;
    return questions.reduce((acc, question) => acc + (question.timePerQuestion ?? DEFAULT_TIME_PER_QUESTION), 0);
  }, [questions]);

  const { timeLeft, reset, start } = useTimer({
    durationMs: totalDuration,
    autoStart: true,
    onTick: (msLeft) => {
      const display = formatTime(msLeft);
      setTimerAnnouncement(`Còn ${display}`);
    },
    onComplete: () => {
      finishQuiz(true);
    },
  });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )).filter((node) => !node.hasAttribute('disabled'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    reset(totalDuration);
    start();
  }, [reset, totalDuration, start]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    const record = records[currentIndex];
    if (record.selectedIndex !== null) return;

    const isCorrect = optionIndex === currentQuestion.answerIndex;
    const nextRecords = records.slice();
    nextRecords[currentIndex] = {
      ...record,
      selectedIndex: optionIndex,
      isCorrect,
    };
    setRecords(nextRecords);

    if (isCorrect) {
      setTimeout(() => moveToNext(), 800);
    } else {
      setRevealed(true);
    }
  };

  const moveToNext = () => {
    if (currentIndex >= questions.length - 1) {
      finishQuiz(false);
      return;
    }
    setRevealed(false);
    setCurrentIndex((prev) => prev + 1);
  };

  function finishQuiz(forced: boolean) {
    const evaluated = forced
      ? records.map((record) => ({
          ...record,
          selectedIndex: record.selectedIndex,
          isCorrect: record.selectedIndex === null ? false : record.isCorrect,
        }))
      : records;
    const correct = evaluated.filter((entry) => entry.isCorrect).length;
    const total = evaluated.length;
    reset();
    onComplete({
      correct,
      total,
      answers: evaluated,
      durationMs: totalDuration - timeLeft,
      startedAt: startedAt.current,
    });
  }

  if (!questions.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/60 px-4" role="dialog" aria-modal="true">
        <div className="w-full max-w-lg rounded-2xl border border-brand-blue bg-white p-6 text-center shadow-xl">
          <p className="text-lg font-semibold text-brand-text">Chưa có ngân hàng câu hỏi cho mốc này.</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/60 px-4" role="dialog" aria-modal="true" aria-labelledby="quiz-dialog-title">
      <div ref={dialogRef} className="w-full max-w-3xl overflow-hidden rounded-3xl border-2 border-brand-blue bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-brand-blue/20 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-blue">Quiz lần {attemptNumber}</p>
            <h2 id="quiz-dialog-title" className="text-2xl font-serif text-brand-text">
              Kiểm tra kiến thức lịch sử
            </h2>
            <p className="mt-1 text-sm text-brand-muted" aria-live="polite">
              Câu {currentIndex + 1}/{questions.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue" aria-live="polite">
              {formatTime(timeLeft)} còn lại
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10"
            >
              Thoát
            </button>
          </div>
        </header>
        <div className="sr-only" aria-live="polite">
          {timerAnnouncement}
        </div>
        <section className="grid gap-4 px-6 py-6">
          <h3 className="text-lg font-semibold text-brand-text">{currentQuestion.prompt}</h3>
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const record = records[currentIndex];
              const selected = record.selectedIndex === index;
              const correct = record.correctIndex === index;
              const status = record.selectedIndex !== null ? (correct ? 'correct' : selected ? 'incorrect' : 'idle') : 'idle';
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(index)}
                  disabled={record.selectedIndex !== null}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                    status === 'correct'
                      ? 'border-green-600 bg-green-600/10 text-green-700'
                      : status === 'incorrect'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600'
                      : 'border-brand-blue/40 hover:border-brand-blue'
                  }`}
                  aria-pressed={selected}
                  aria-disabled={record.selectedIndex !== null}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {revealed && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-100/60 p-4 text-sm text-amber-700" aria-live="polite">
              <p>
                Đáp án đúng: {currentQuestion.options[currentQuestion.answerIndex]}
              </p>
              <p className="mt-2 text-brand-text">{currentQuestion.explanation}</p>
              <button
                type="button"
                onClick={moveToNext}
                className="mt-3 rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
              >
                Tiếp tục
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default QuizRunner;
