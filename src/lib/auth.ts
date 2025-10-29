import { localAuth } from './localAuth';

export type AppUser = {
  id: string;
  fullName: string;
  email?: string;
};

/**
 * Returns the current authenticated user or null. Falls back to a demo profile stored in localStorage.
 */
export function getActiveUser(): AppUser | null {
  const existing = localAuth.getCurrentUser?.();
  if (existing) {
    return {
      id: String(existing.id ?? existing.email ?? 'local-user'),
      fullName: existing.display_name ?? existing.email ?? 'Thành viên',
      email: existing.email,
    };
  }

  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem('demo_user_profile');
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as AppUser;
    return parsed ?? null;
  } catch (error) {
    console.warn('Không thể đọc demo_user_profile:', error);
    return null;
  }
}

export function setActiveUser(user: AppUser) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('demo_user_profile', JSON.stringify(user));
}

export function clearActiveUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('demo_user_profile');
  localAuth.logout?.();
}

export function isAuthenticated(): boolean {
  return Boolean(getActiveUser());
}
