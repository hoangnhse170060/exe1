import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
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

export type ContactSubmission = {
  full_name: string;
  email: string;
  message: string;
};
