type Props = {
  score: number;
  stars: number;
  correct: number;
  total: number;
  attemptNumber: number;
  onRetry: () => void;
  onReview: () => void;
  onClose: () => void;
  nextCta?: () => void;
};

const starMessages: Record<number, string> = {
  0: 'Bạn có thể luyện tập thêm để đạt được sao.',
  3: 'Khởi đầu tốt! Tiếp tục luyện tập để tăng số sao.',
  6: 'Tuyệt vời! Bạn đã nắm chắc kiến thức.',
  8: 'Xuất sắc! Thử thách bản thân ở mức cao hơn.',
  12: 'Hoàn hảo! Bạn đã trả lời chính xác toàn bộ câu hỏi.',
};

export function QuizResult({
  score,
  stars,
  correct,
  total,
  attemptNumber,
  onRetry,
  onReview,
  onClose,
  nextCta,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/60 px-4" role="dialog" aria-modal="true" aria-labelledby="quiz-result-title">
      <div className="w-full max-w-2xl rounded-3xl border-2 border-brand-blue bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 id="quiz-result-title" className="text-3xl font-serif text-brand-text">
            Kết quả Quiz
          </h2>
          <p className="text-sm uppercase tracking-widest text-brand-muted">Lần {attemptNumber}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-lg font-semibold text-brand-text">
            <span className="rounded-full bg-brand-blue/10 px-4 py-2 text-brand-blue">Điểm: {score}%</span>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-amber-600" aria-label={`Bạn nhận ${stars} sao`}>
              {stars} ⭐
            </span>
            <span className="rounded-full bg-brand-blue/10 px-4 py-2 text-brand-text">
              {correct}/{total} câu đúng
            </span>
          </div>
          <p className="mt-4 max-w-xl text-base text-brand-text">
            {starMessages[stars] ?? starMessages[0]}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-brand-blue px-5 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10"
          >
            Làm lại
          </button>
          <button
            type="button"
            onClick={onReview}
            className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90"
          >
            Xem giải thích toàn bài
          </button>
          {nextCta && (
            <button
              type="button"
              onClick={nextCta}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Quiz giai đoạn tiếp theo
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-text px-5 py-2 text-sm font-semibold text-white hover:bg-brand-text/80"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
