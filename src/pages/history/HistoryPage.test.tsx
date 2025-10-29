import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, beforeEach, vi } from 'vitest';

vi.mock('../../lib/auth', async () => {
  const actual = await vi.importActual<typeof import('../../lib/auth')>('../../lib/auth');
  return {
    ...actual,
    getActiveUser: vi.fn(),
    isAuthenticated: vi.fn(),
  };
});

import HistoryPage from '.';
import { getActiveUser, isAuthenticated } from '../../lib/auth';

type MockedFn<T extends (...args: any[]) => any> = ReturnType<typeof vi.fn<T>>;

const mockedGetActiveUser = getActiveUser as unknown as MockedFn<typeof getActiveUser>;
const mockedIsAuthenticated = isAuthenticated as unknown as MockedFn<typeof isAuthenticated>;

describe('HistoryPage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedGetActiveUser.mockReturnValue(null);
    mockedIsAuthenticated.mockReturnValue(false);
  });

  it('renders guest view without timeline', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/history' }]}> 
        <HistoryPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Đăng nhập để mở khóa/i)).toBeInTheDocument();
    });

    expect(await screen.findByLabelText(/Dòng thời gian sự kiện/i)).toBeInTheDocument();
    const previewMessages = await screen.findAllByText(/Đăng nhập để mở khóa nội dung đầy đủ/i);
    expect(previewMessages.length).toBeGreaterThan(0);
  });

  it('shows timeline for authenticated users', async () => {
    mockedGetActiveUser.mockReturnValue({ id: 'tester', fullName: 'Tester' });
    mockedIsAuthenticated.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={[{ pathname: '/history' }]}> 
        <HistoryPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Dòng thời gian sự kiện/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Quiz kiểm tra kiến thức/i)).toBeInTheDocument();
    });
  });
});
