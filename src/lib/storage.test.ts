import { beforeEach, describe, expect, it } from 'vitest';
import {
  getHistoryProgress,
  recordQuizAttempt,
  saveQuizState,
  getQuizState,
  updateHistoryProgress,
  type PersistedQuizState,
} from './storage';

const userId = 'tester';
const eventId = 'event-1';

describe('storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('updates read ratio and auto-completes beyond threshold', () => {
    const initial = getHistoryProgress(userId, eventId);
    expect(initial.readRatio).toBe(0);
    const mid = updateHistoryProgress(userId, eventId, { readRatio: 0.5 });
    expect(mid.readRatio).toBeCloseTo(0.5, 2);
    expect(mid.completedAt).toBeUndefined();
    const completed = updateHistoryProgress(userId, eventId, { readRatio: 0.82 });
    expect(completed.readRatio).toBeGreaterThanOrEqual(0.82);
    expect(completed.completedAt).toBeTruthy();
  });

  it('records quiz attempt and tracks best results', () => {
    const first = recordQuizAttempt(userId, eventId, {
      attemptNumber: 1,
      score: 80,
      stars: 6,
      correct: 8,
      total: 10,
      attemptedAt: new Date().toISOString(),
      questionIds: ['q1', 'q2'],
    });
    expect(first.bestScore).toBe(80);
    expect(first.bestStars).toBe(6);
    const second = recordQuizAttempt(userId, eventId, {
      attemptNumber: 2,
      score: 95,
      stars: 8,
      correct: 19,
      total: 20,
      attemptedAt: new Date().toISOString(),
      questionIds: ['q3'],
    });
    expect(second.attempts).toHaveLength(2);
    expect(second.bestScore).toBe(95);
    expect(second.bestStars).toBe(8);
  });

  it('persists quiz state blob', () => {
    expect(getQuizState(userId, eventId)).toBeNull();
    const state = {
      eventId,
      startedAt: new Date().toISOString(),
      questionIds: ['q1', 'q2'],
      answers: [0, null],
      expiresAt: new Date(Date.now() + 60000).toISOString(),
    } satisfies PersistedQuizState;
    saveQuizState(userId, state);
    const stored = getQuizState(userId, eventId);
    expect(stored).toMatchObject({ questionIds: ['q1', 'q2'] });
    saveQuizState(userId, null, eventId);
    expect(getQuizState(userId, eventId)).toBeNull();
  });
});
