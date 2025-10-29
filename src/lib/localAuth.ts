// Local Authentication Service (for development without Supabase)

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  display_name: string;
  role: 'user' | 'shopOwner' | 'admin';
  stars: number;
  phone?: string;
  date_of_birth?: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  shop_id?: string;
  created_at: string;
}

export interface LocalShop {
  id: string;
  owner_id: string;
  shop_name: string;
  package_type: 'BASIC' | 'PRO';
  revenue: number;
  revenue_limit: number;
  created_at: string;
}

// Local storage keys
const USERS_KEY = 'local_users';
const CURRENT_USER_KEY = 'local_current_user';
const SHOPS_KEY = 'local_shops';

// Seed data - Test accounts
const SEED_USERS: LocalUser[] = [
  // Admins
  {
    id: 'admin-1',
    email: 'admin@echoes.vn',
    password: 'admin123',
    display_name: 'Admin User',
    role: 'admin',
    stars: 500,
    phone: '0901234560',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'admin-2',
    email: 'admin2@echoes.vn',
    password: 'admin123',
    display_name: 'Admin Two',
    role: 'admin',
    stars: 450,
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'admin-3',
    email: 'admin3@echoes.vn',
    password: 'admin123',
    display_name: 'Admin Three',
    role: 'admin',
    stars: 400,
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  // Users
  {
    id: 'user-1',
    email: 'user1@echoes.vn',
    password: 'user123',
    display_name: 'Nguyen Van A',
    role: 'user',
    stars: 50,
    phone: '0901234567',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'user2@echoes.vn',
    password: 'user123',
    display_name: 'Tran Thi B',
    role: 'user',
    stars: 150,
    phone: '0901234568',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-3',
    email: 'user3@echoes.vn',
    password: 'user123',
    display_name: 'Le Van C',
    role: 'user',
    stars: 250,
    phone: '0901234569',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-4',
    email: 'user4@echoes.vn',
    password: 'user123',
    display_name: 'Pham Thi D',
    role: 'user',
    stars: 180,
    phone: '0901234570',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-5',
    email: 'user5@echoes.vn',
    password: 'user123',
    display_name: 'Hoang Van E',
    role: 'user',
    stars: 300,
    phone: '0901234571',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  // Shop Owners
  {
    id: 'shop-1',
    email: 'shop1@echoes.vn',
    password: 'shop123',
    display_name: 'Heritage Crafts Owner',
    role: 'shopOwner',
    stars: 300,
    phone: '0901234572',
    shop_id: 'shop-basic-1',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'shop-2',
    email: 'shop2@echoes.vn',
    password: 'shop123',
    display_name: 'Vintage Treasures Owner',
    role: 'shopOwner',
    stars: 500,
    phone: '0901234573',
    shop_id: 'shop-pro-1',
    is_email_verified: true,
    is_phone_verified: true,
    created_at: new Date().toISOString(),
  },
];

const SEED_SHOPS: LocalShop[] = [
  {
    id: 'shop-basic-1',
    owner_id: 'shop-1',
    shop_name: 'Heritage Crafts',
    package_type: 'BASIC',
    revenue: 0,
    revenue_limit: 10000000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'shop-pro-1',
    owner_id: 'shop-2',
    shop_name: 'Vintage Treasures',
    package_type: 'PRO',
    revenue: 0,
    revenue_limit: 30000000,
    created_at: new Date().toISOString(),
  },
];

class LocalAuthService {
  constructor() {
    this.initializeStorage();
  }

  private initializeStorage() {
    // Initialize users if not exists
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      console.log('✅ Local auth initialized with', SEED_USERS.length, 'users');
    }
    
    // Initialize shops if not exists
    if (!localStorage.getItem(SHOPS_KEY)) {
      localStorage.setItem(SHOPS_KEY, JSON.stringify(SEED_SHOPS));
      console.log('✅ Local shops initialized with', SEED_SHOPS.length, 'shops');
    }
  }

  private getUsers(): LocalUser[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getShops(): LocalShop[] {
    const data = localStorage.getItem(SHOPS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: LocalUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Login
  async login(email: string, password: string): Promise<{ user: LocalUser | null; error: string | null }> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return {
        user: null,
        error: 'Email hoặc mật khẩu không đúng',
      };
    }

    // Save current user
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    console.log('✅ Login successful:', user.email, '| Role:', user.role);

    return {
      user,
      error: null,
    };
  }

  // Get current user
  getCurrentUser(): LocalUser | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Get user profile with shop info
  async getUserProfile(userId: string): Promise<{
    profile: LocalUser | null;
    shop: LocalShop | null;
  }> {
    const users = this.getUsers();
    const shops = this.getShops();
    
    const profile = users.find(u => u.id === userId);
    if (!profile) {
      return { profile: null, shop: null };
    }

    const shop = profile.shop_id 
      ? shops.find(s => s.id === profile.shop_id)
      : null;

    return { profile, shop: shop || null };
  }

  // Logout
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    console.log('✅ Logout successful');
  }

  // Register new user
  async register(data: {
    email: string;
    password: string;
    display_name: string;
    phone?: string;
    date_of_birth?: string;
  }): Promise<{ user: LocalUser | null; error: string | null }> {
    const users = this.getUsers();
    
    // Check if email exists
    if (users.find(u => u.email === data.email)) {
      return {
        user: null,
        error: 'Email đã được sử dụng',
      };
    }

    const newUser: LocalUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      display_name: data.display_name,
      role: 'user',
      stars: 0,
      phone: data.phone,
      date_of_birth: data.date_of_birth,
      is_email_verified: true,
      is_phone_verified: false,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    console.log('✅ Registration successful:', newUser.email);

    return {
      user: newUser,
      error: null,
    };
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get user role
  getUserRole(): 'user' | 'shopOwner' | 'admin' | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Update user stars
  async updateUserStars(userId: string, stars: number): Promise<boolean> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;

    users[userIndex].stars = stars;
    this.saveUsers(users);

    // Update current user if it's the same
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.stars = stars;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    return true;
  }

  // Check eligibility for shop
  isEligibleForShop(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    return user ? user.stars >= 200 : false;
  }
}

export const localAuth = new LocalAuthService();
