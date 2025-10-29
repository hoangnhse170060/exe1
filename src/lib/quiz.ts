import type { QuizQuestion } from '../data/history';

/** Fisher-Yates shuffle to randomise quiz questions. */
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Picks between 5 and 10 questions randomly from a quiz bank. */
export function pickQuestions(bank: QuizQuestion[], desired = 6): QuizQuestion[] {
  if (!bank.length) return [];
  const safeDesired = Math.max(5, Math.min(10, desired, bank.length));
  return shuffle(bank).slice(0, safeDesired);
}

export type GradeResult = {
  score: number;
  stars: number;
  passed: boolean;
};

/** Applies star rules depending on attempt number and accuracy. */
export function calculateStars(score: number, attemptNumber: number): number {
  if (attemptNumber <= 1) {
    if (score < 70) return 0;
    if (score < 80) return 3;
    if (score < 90) return 6;
    if (score < 100) return 8;
    return 12;
  }

  if (score < 90) return 0;
  if (score < 100) return 8;
  return 12;
}

/** Grades an attempt and returns score percentage, stars, pass/fail. */
export function gradeQuiz(correct: number, total: number, attemptNumber: number): GradeResult {
  const safeTotal = Math.max(total, 1);
  const percentage = Math.round((correct / safeTotal) * 100);
  const stars = calculateStars(percentage, attemptNumber);
  const passed = attemptNumber === 1 ? percentage >= 70 : percentage >= 90;
  return {
    score: percentage,
    stars,
    passed,
  };
}
