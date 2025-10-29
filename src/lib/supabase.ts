import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnvMessage =
  'Supabase environment variables are not set. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.';

const createMockSupabaseClient = (): SupabaseClient => {
  const warnOnce = (() => {
    let warned = false;
    return () => {
      if (!warned) {
        warned = true;
        console.warn(missingEnvMessage);
      }
    };
  })();

  const resolveWithError = <T>(data: T): Promise<{ data: T; error: Error }> => {
    warnOnce();
    return Promise.resolve({ data, error: new Error(missingEnvMessage) });
  };

  const resolveSuccess = <T>(data: T): Promise<{ data: T; error: null }> => {
    warnOnce();
    return Promise.resolve({ data, error: null });
  };

  const createQuery = () => {
    const promise = resolveWithError(null);
    const query: any = {
      select: (..._args: any[]) => query,
      insert: (..._args: any[]) => promise,
      update: (..._args: any[]) => promise,
      delete: (..._args: any[]) => promise,
      eq: (..._args: any[]) => query,
      neq: (..._args: any[]) => query,
      gt: (..._args: any[]) => query,
      gte: (..._args: any[]) => query,
      lt: (..._args: any[]) => query,
      lte: (..._args: any[]) => query,
      single: (..._args: any[]) => promise,
      order: (..._args: any[]) => query,
      limit: (..._args: any[]) => query,
      then: promise.then.bind(promise),
      catch: promise.catch.bind(promise),
      finally: promise.finally.bind(promise),
    };
    return query;
  };

  return {
    auth: {
      signInWithPassword: (..._args: any[]) => resolveWithError({ user: null, session: null }),
      signUp: (..._args: any[]) => resolveWithError({ user: null, session: null }),
      signOut: (..._args: any[]) => resolveSuccess(undefined),
      getSession: (..._args: any[]) => resolveSuccess({ session: null }),
      getUser: (..._args: any[]) => resolveSuccess({ user: null }),
      signInWithOAuth: (..._args: any[]) => resolveSuccess({ data: { provider: null, url: null }, error: null }),
      resetPasswordForEmail: (..._args: any[]) => resolveSuccess({}),
      onAuthStateChange: (..._args: any[]) => ({
        data: { subscription: { unsubscribe: () => {} } },
        error: null,
      }),
    },
    from: (..._args: any[]) => createQuery(),
    storage: {
      from: (..._args: any[]) => ({
        upload: (..._args: any[]) => resolveWithError(null),
        download: (..._args: any[]) => resolveWithError(null),
        getPublicUrl: (..._args: any[]) => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient;
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your_supabase_url_here') &&
  !supabaseAnonKey.includes('your_supabase_anon_key_here')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
  seller_name?: string;
  seller_title?: string;
  seller_location?: string;
  seller_contact?: string;
};

export type ForumPost = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  created_at: string;
  user_profiles?: {
    display_name: string;
    avatar_url?: string;
  };
};

export type ForumComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_profiles?: {
    display_name: string;
    avatar_url?: string;
  };
};

export type ForumReaction = {
  id: string;
  post_id: string;
  user_id: string;
  emotion: 'like' | 'proud' | 'haha' | 'love';
  created_at: string;
};

export type ContactSubmission = {
  full_name: string;
  email: string;
  message: string;
};

export type Order = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
};

export type ProductReview = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type SellerChat = {
  id: string;
  product_id: string;
  user_id: string;
  message: string;
  created_at: string;
};

export type Seller = {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
};
