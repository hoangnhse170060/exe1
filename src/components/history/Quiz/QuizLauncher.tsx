type Props = {
  canLaunch: boolean;
  onLaunch: () => void;
  attempts: number;
  bestScore?: number;
  bestStars?: number;
};

export function QuizLauncher({ canLaunch, onLaunch, attempts, bestScore, bestStars }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-brand-blue/5 p-4">
      <div>
        <h3 className="text-lg font-semibold text-brand-text">Quiz kiểm tra kiến thức</h3>
        <p className="text-sm text-brand-muted">
          Hoàn thành đọc nội dung để mở khóa bộ câu hỏi 5–10 câu với thời gian giới hạn. Điểm cao sẽ tích sao cho hồ sơ.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-brand-muted">
        <span>Lượt đã làm: {attempts}</span>
        {typeof bestScore === 'number' && <span>Điểm cao nhất: {bestScore}%</span>}
        {typeof bestStars === 'number' && bestStars > 0 && <span>☆ Tối đa: {bestStars} sao</span>}
      </div>
      <button
        type="button"
        onClick={onLaunch}
        disabled={!canLaunch}
        className="self-start rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition enabled:hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:bg-brand-blue/40"
        aria-disabled={!canLaunch}
      >
        {canLaunch ? 'Làm Quiz' : 'Đọc 80% nội dung để mở khóa'}
      </button>
    </div>
  );
}

export default QuizLauncher;
