import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Facebook,
  Youtube,
  Instagram,
  Clock,
  LogIn,
  MessageSquare,
  User,
  Store,
  Shield,
  LogOut,
  Settings,
  Home,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';

type SidebarUser = {
  id: string;
  displayName: string;
  email: string;
  role: 'user' | 'shopOwner' | 'admin';
  avatarUrl?: string | null;
};

type NavItem = {
  id: string;
  label: string;
  path: string;
  subItems?: Array<{ label: string; path: string }>;
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const isAdminDashboard = location.pathname === '/admin-dashboard';

  const navItems: NavItem[] = [
    { id: 'home', label: 'HOME', path: '/' },
    {
      id: 'history',
      label: 'HISTORY',
      path: '/history',
      subItems: [
        { label: 'French Era', path: '/history?phase=antiFrench' },
        { label: 'American Era', path: '/history?phase=antiAmerican' },
      ],
    },
    { id: 'shop', label: 'SHOP', path: '/shop' },
    { id: 'forum', label: 'FORUM', path: '/forum' },
    { id: 'services', label: 'SERVICES', path: '/services' },
    { id: 'contact', label: 'CONTACT', path: '/contact' },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', url: '#' },
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Youtube, label: 'YouTube', url: '#' },
    { icon: MessageSquare, label: 'TikTok', url: '#' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname !== '/login') {
      sessionStorage.setItem('lastVisitedPath', location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isAdminDashboard) {
      setIsOpen(false);
    }
  }, [isAdminDashboard]);

  useEffect(() => {
    const updateUser = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          if (!supaUser) {
            setUser(null);
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, email, role, avatar_url')
            .eq('id', supaUser.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              displayName: profile.display_name || supaUser.email || 'Thành viên',
              email: profile.email || supaUser.email || '',
              role: (profile.role as SidebarUser['role']) || 'user',
              avatarUrl: (profile as any).avatar_url || null,
            });
          } else {
            setUser({
              id: supaUser.id,
              displayName: supaUser.email || 'Thành viên',
              email: supaUser.email || '',
              role: 'user',
              avatarUrl: null,
            });
          }
        } else {
          const currentUser = localAuth.getCurrentUser();
          if (!currentUser) {
            setUser(null);
            return;
          }

          const { profile } = await localAuth.getUserProfile(currentUser.id);
          if (profile) {
            const { password: _password, ...rest } = profile as any;
            setUser({
              id: rest.id,
              displayName: rest.display_name,
              email: rest.email,
              role: rest.role,
              avatarUrl: null,
            });
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Không thể tải thông tin người dùng:', error);
        setUser(null);
      }
    };

    void updateUser();
  }, [location.pathname]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void (async () => {
        try {
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          if (!supaUser) {
            setUser(null);
            return;
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, email, role, avatar_url')
            .eq('id', supaUser.id)
            .single();
          if (profile) {
            setUser({
              id: profile.id,
              displayName: profile.display_name || supaUser.email || 'Thành viên',
              email: profile.email || supaUser.email || '',
              role: (profile.role as SidebarUser['role']) || 'user',
              avatarUrl: (profile as any).avatar_url || null,
            });
          }
        } catch (error) {
          setUser(null);
        }
      })();
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      } else {
        localAuth.logout();
      }
    } catch (error) {
      console.error('Không thể đăng xuất:', error);
    } finally {
      setUser(null);
      setIsUserMenuOpen(false);
      navigate('/');
    }
  };

  const handleLoginClick = () => {
    const fromPath = location.pathname !== '/login'
      ? location.pathname
      : sessionStorage.getItem('lastVisitedPath') || '/';
    navigate('/login', { state: { from: fromPath } });
    setIsOpen(false);
  };

  const roleAccent = (role: SidebarUser['role']) => {
    switch (role) {
      case 'admin':
        return 'from-rose-500 via-rose-400 to-orange-400';
      case 'shopOwner':
        return 'from-purple-500 via-indigo-500 to-blue-500';
      default:
        return 'from-blue-500 via-sky-500 to-cyan-500';
    }
  };

  const roleIcon = (role: SidebarUser['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3.5 w-3.5" />;
      case 'shopOwner':
        return <Store className="h-3.5 w-3.5" />;
      default:
        return <User className="h-3.5 w-3.5" />;
    }
  };

  return (
    <>
      {!isAdminDashboard && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-charcoal-900 shadow-brand transition hover:bg-white"
          aria-label="Toggle Menu"
          type="button"
        >
          {isOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      )}

      <div className="fixed top-6 right-6 z-50 flex items-center gap-3" ref={userMenuRef}>
        {user ? (
          <div className="relative">
            <div
              className={`flex items-center gap-2 ${
                isAdminDashboard
                  ? 'rounded-full bg-slate-900/80 p-1 pl-1 pr-2 shadow-xl shadow-indigo-200/60 backdrop-blur'
                  : ''
              }`}
            >
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-3 rounded-full px-3 py-2 text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  isAdminDashboard
                    ? 'bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 shadow-lg shadow-indigo-200/60 hover:shadow-xl'
                    : 'bg-brand-blue shadow-brand hover:bg-brand-blue-600'
                }`}
                type="button"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${roleAccent(user.role)} text-white font-semibold shadow-lg`}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.displayName.charAt(0).toUpperCase()
                  )}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold leading-4">{user.displayName}</p>
                  <span className={`flex items-center gap-1 text-xs uppercase tracking-wide ${isAdminDashboard ? 'text-white/80' : 'text-white/80'}`}>
                    {roleIcon(user.role)}
                    {user.role === 'admin' ? 'Admin' : user.role === 'shopOwner' ? 'Shop Owner' : 'Member'}
                  </span>
                </div>
              </button>
              {isAdminDashboard && (
                <button
                  onClick={() => navigate('/')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-600 shadow-lg shadow-indigo-200/60 transition hover:-translate-y-0.5 hover:bg-white"
                  aria-label="Quay về trang chủ"
                  type="button"
                >
                  <Home size={22} />
                </button>
              )}
            </div>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-slate-900/95 text-white shadow-xl backdrop-blur-md">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-sm font-semibold">{user.displayName}</p>
                  <p className="truncate text-xs text-white/70">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4" />
                    Chỉnh sửa cá nhân
                  </button>
                  {user.role === 'shopOwner' && (
                    <button
                      onClick={() => handleNavigation('/shop-dashboard')}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      <Store className="h-4 w-4" />
                      Shop của bạn
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleNavigation('/admin-dashboard')}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </button>
                  )}
                </div>
                <div className="border-t border-white/10 px-4 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 text-sm text-rose-300 hover:text-rose-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex items-center space-x-2 px-4 py-2 text-brand-blue transition-colors duration-300 hover:text-brand-blue-700"
            aria-label="Open Login"
            type="button"
          >
            <LogIn className="transition-colors" size={20} />
            <span className="tracking-wide uppercase text-sm">Login</span>
          </button>
        )}
      </div>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[30%] min-w-[320px] max-w-[400px] transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sidebar-elegant`}
      >
        <div className="flex h-full">
          <div className="relative flex flex-1 flex-col px-10 py-12">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 left-8 z-10 flex h-10 w-10 items-center justify-center text-charcoal-600 transition-all duration-300 hover:scale-110 hover:text-charcoal-900"
              aria-label="Close Menu"
              type="button"
            >
              <X size={20} />
            </button>

            <div
              className="cursor-pointer pt-12"
              onClick={() => handleNavigation('/')}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center">
                <Clock className="text-brand-blue" size={32} />
              </div>
              <h1 className="text-xl font-display uppercase leading-snug tracking-wider text-charcoal-900">
                ECHOES OF
                <br />
                VIỆT NAM
              </h1>
            </div>

            <nav className="mt-12 flex-1 space-y-4">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`group relative py-1.5 text-left font-serif text-base uppercase tracking-wide transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-charcoal-900 menu-item-active-elegant'
                        : 'text-charcoal-800 hover:text-brand-blue menu-item-elegant'
                    }`}
                    type="button"
                  >
                    {item.label}
                  </button>
                  {item.subItems && (
                    <div className="ml-4 mt-1.5 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.path}
                          onClick={() => handleNavigation(subItem.path)}
                          className="block py-0.5 text-left text-sm text-charcoal-600 transition-colors duration-300 hover:text-brand-blue"
                          type="button"
                        >
                          - {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="space-y-6 pt-6">
              <div className="space-y-2 text-xs text-charcoal-600">
                <p>
                  Mon–Thu: <span className="font-medium text-charcoal-900">8:00–17:00</span>
                </p>
                <p>
                  Fri–Sun: <span className="font-medium text-charcoal-900">8:00–18:00</span>
                </p>
              </div>

              <div className="flex space-x-4 pt-2">
                {socialLinks.slice(0, 3).map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    className="text-brand-muted transition-all duration-300 hover:text-brand-blue"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/70 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
