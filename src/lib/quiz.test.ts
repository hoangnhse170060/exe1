import { describe, expect, it } from 'vitest';
import { calculateStars, gradeQuiz, pickQuestions, shuffle } from './quiz';
import type { QuizQuestion } from '../data/history';

const bank: QuizQuestion[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `q${index}`,
  subEventId: `sub-${index % 2}`,
  eventId: 'sample',
  eraId: 'french',
  prompt: `Prompt ${index}`,
  options: ['A', 'B', 'C', 'D'],
  answerIndex: index % 4,
  explanation: 'Giải thích',
}));

describe('pickQuestions', () => {
  it('returns at least 5 questions and at most 10', () => {
    const selection = pickQuestions(bank, 7);
    expect(selection).toHaveLength(7);
  });

  it('caps selection when bank smaller than desired', () => {
    const smallBank = bank.slice(0, 5);
    const selection = pickQuestions(smallBank, 9);
    expect(selection).toHaveLength(5);
  });
});

describe('shuffle', () => {
  it('shuffles deterministically with seeded rng', () => {
    const rngValues = [0.1, 0.8, 0.3, 0.6, 0.2, 0.5, 0.9, 0.4];
    let cursor = 0;
    const seeded = shuffle([1, 2, 3, 4, 5], () => rngValues[cursor++ % rngValues.length]);
    expect(seeded).not.toEqual([1, 2, 3, 4, 5]);
    expect(seeded.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('gradeQuiz', () => {
  it('applies star table for first attempt', () => {
    const first = gradeQuiz(8, 10, 1);
    expect(first.score).toBe(80);
    expect(first.stars).toBe(6);
    expect(first.passed).toBe(true);
  });

  it('requires >=90% for stars on retry', () => {
    const retry = gradeQuiz(8, 10, 2);
    expect(retry.stars).toBe(0);
    expect(retry.passed).toBe(false);

    const excellent = gradeQuiz(9, 10, 3);
    expect(excellent.stars).toBe(8);
    expect(excellent.passed).toBe(true);
  });
});

describe('calculateStars', () => {
  it('awards full stars only at 100%', () => {
    expect(calculateStars(100, 1)).toBe(12);
    expect(calculateStars(95, 2)).toBe(8);
    expect(calculateStars(65, 1)).toBe(0);
  });
});
