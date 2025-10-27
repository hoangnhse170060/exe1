import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, User, Plus, Send, LogIn, LogOut } from 'lucide-react';
import { supabase, type ForumPost, type ForumComment } from '../lib/supabase';

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Trao đổi lịch sử',
  });

  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    checkUser();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user || null);
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          user_profiles (
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          *,
          user_profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            display_name: authForm.displayName,
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });

        if (error) throw error;
      }

      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', displayName: '' });
      checkUser();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('forum_posts').insert({
        user_id: user.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
      });

      if (error) throw error;

      setShowNewPostModal(false);
      setNewPost({ title: '', content: '', category: 'Trao đổi lịch sử' });
      fetchPosts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPost) return;

    try {
      const { error } = await supabase.from('forum_comments').insert({
        post_id: selectedPost.id,
        user_id: user.id,
        content: newComment,
      });

      if (error) throw error;

      setNewComment('');
      fetchComments(selectedPost.id);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const categories = ['Trao đổi lịch sử', 'Cảm nhận cá nhân', 'Bài nghiên cứu'];

  return (
    <div className="min-h-screen bg-vietnam-black pt-20">
      <div className="relative h-80 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg)',
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-vietnam-white mb-4">
              DIỄN ĐÀN
            </h1>
            <p className="text-xl text-vietnam-gold font-serif italic">
              Trao đổi và thảo luận về lịch sử
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-vietnam-red text-vietnam-white hover:bg-vietnam-red/90 transition-all duration-300"
                >
                  <Plus size={20} />
                  <span>Tạo Bài Viết</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-vietnam-red text-vietnam-red hover:bg-vietnam-red hover:text-vietnam-white transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span>Đăng Xuất</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-vietnam-red text-vietnam-white hover:bg-vietnam-red/90 transition-all duration-300"
              >
                <LogIn size={20} />
                <span>Đăng Nhập / Đăng Ký</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-vietnam-white">
            <div className="animate-spin w-12 h-12 border-4 border-vietnam-red border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-vietnam-black border border-vietnam-red/30 hover:border-vietnam-red p-6 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-vietnam-red rounded-full flex items-center justify-center">
                      <User size={20} className="text-vietnam-white" />
                    </div>
                    <div>
                      <p className="text-vietnam-white font-sans">
                        {post.user_profiles?.display_name || 'Anonymous'}
                      </p>
                      <p className="text-vietnam-white/50 text-xs">
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-vietnam-gold px-3 py-1 border border-vietnam-gold">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-vietnam-white mb-3 hover:text-vietnam-red transition-colors">
                  {post.title}
                </h3>
                <p className="text-vietnam-white/70 mb-4 line-clamp-2">{post.content}</p>

                <div className="flex items-center space-x-6 text-vietnam-white/50 text-sm">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp size={16} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={16} />
                    <span>Bình luận</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-vietnam-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-vietnam-black border-2 border-vietnam-red max-w-md w-full p-8">
            <h2 className="text-3xl font-serif text-vietnam-white mb-6">
              {authMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-vietnam-white mb-2">Tên Hiển Thị</label>
                  <input
                    type="text"
                    value={authForm.displayName}
                    onChange={(e) => setAuthForm({ ...authForm, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-vietnam-black border border-vietnam-red/30 text-vietnam-white focus:border-vietnam-red outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-vietnam-white mb-2">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-vietnam-black border border-vietnam-red/30 text-vietnam-white focus:border-vietnam-red outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-vietnam-white mb-2">Mật Khẩu</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-vietnam-black border border-vietnam-red/30 text-vietnam-white focus:border-vietnam-red outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-vietnam-red text-vietnam-white hover:bg-vietnam-red/90 transition-all duration-300"
              >
                {authMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="w-full text-vietnam-gold hover:text-vietnam-white transition-colors"
              >
                {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full text-vietnam-white/50 hover:text-vietnam-white transition-colors"
              >
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}

      {showNewPostModal && (
        <div className="fixed inset-0 bg-vietnam-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-vietnam-black border-2 border-vietnam-red max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-serif text-vietnam-white mb-6">Tạo Bài Viết Mới</h2>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-vietnam-white mb-2">Danh Mục</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-3 bg-vietnam-black border border-vietnam-red/30 text-vietnam-white focus:border-vietnam-red outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-vietnam-white mb-2">Tiêu Đề</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 bg-vietnam-black border border-vietnam-red/30 text-vietnam-white focus:border-vietnam-red outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-vietnam-white mb-2">Nội Dung</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 bg-vietnam-black border border-vietnam-red/30 text-vietnam-white focus:border-vietnam-red outline-none resize-none"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-vietnam-red text-vietnam-white hover:bg-vietnam-red/90 transition-all duration-300"
                >
                  Đăng Bài
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 py-3 border-2 border-vietnam-red text-vietnam-red hover:bg-vietnam-red hover:text-vietnam-white transition-all duration-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 bg-vietnam-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-vietnam-black border-2 border-vietnam-red max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-vietnam-red rounded-full flex items-center justify-center">
                    <User size={24} className="text-vietnam-white" />
                  </div>
                  <div>
                    <p className="text-vietnam-white font-sans">
                      {selectedPost.user_profiles?.display_name || 'Anonymous'}
                    </p>
                    <p className="text-vietnam-white/50 text-sm">
                      {new Date(selectedPost.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-vietnam-white hover:text-vietnam-red transition-colors"
                >
                  ✕
                </button>
              </div>

              <span className="inline-block text-xs text-vietnam-gold px-3 py-1 border border-vietnam-gold mb-4">
                {selectedPost.category}
              </span>

              <h2 className="text-3xl font-serif text-vietnam-white mb-4">{selectedPost.title}</h2>
              <p className="text-vietnam-white/80 leading-relaxed mb-8 whitespace-pre-wrap">
                {selectedPost.content}
              </p>

              <div className="border-t border-vietnam-red/30 pt-6">
                <h3 className="text-xl font-serif text-vietnam-white mb-4">Bình Luận</h3>

                {user && (
                  <form onSubmit={handleAddComment} className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận..."
                      rows={3}
                      className="w-full px-4 py-3 bg-vietnam-black border border-vietnam-red/30 text-vietnam-white focus:border-vietnam-red outline-none resize-none mb-2"
                      required
                    />
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-vietnam-red text-vietnam-white hover:bg-vietnam-red/90 transition-all duration-300"
                    >
                      <Send size={16} />
                      <span>Gửi</span>
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-vietnam-red pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-vietnam-red rounded-full flex items-center justify-center">
                          <User size={16} className="text-vietnam-white" />
                        </div>
                        <div>
                          <p className="text-vietnam-white text-sm">
                            {comment.user_profiles?.display_name || 'Anonymous'}
                          </p>
                          <p className="text-vietnam-white/50 text-xs">
                            {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <p className="text-vietnam-white/80 text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
