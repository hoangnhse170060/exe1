import { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  User,
  Plus,
  Send,
  LogIn,
  LogOut,
  Heart,
  Laugh,
  Medal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase, type ForumPost, type ForumComment } from '../lib/supabase';

type EmotionKey = 'like' | 'proud' | 'haha' | 'love';

type ReactionSummary = Record<EmotionKey, number>;

const EMOTION_KEYS: EmotionKey[] = ['like', 'proud', 'haha', 'love'];

const EMOTION_CONFIG: Record<EmotionKey, { label: string; icon: LucideIcon }> = {
  like: { label: 'Like', icon: ThumbsUp },
  proud: { label: 'Tự hào', icon: Medal },
  haha: { label: 'Haha', icon: Laugh },
  love: { label: 'Tim', icon: Heart },
};

const createEmptyReactionSummary = (): ReactionSummary => ({
  like: 0,
  proud: 0,
  haha: 0,
  love: 0,
});

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [latestComments, setLatestComments] = useState<Record<string, ForumComment | null>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [reactionSummaries, setReactionSummaries] = useState<Record<string, ReactionSummary>>({});

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
    setLoading(true);
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

      const postData = data || [];
      setPosts(postData);

      if (postData.length) {
        const postIds = postData.map((post) => post.id);
        void loadPostMeta(postIds);
      } else {
        setLatestComments({});
        setCommentCounts({});
        setReactionSummaries({});
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPostMeta = async (postIds: string[]) => {
    if (!postIds.length) {
      return;
    }

    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('forum_comments')
        .select(`
          *,
          user_profiles (
            display_name,
            avatar_url
          )
        `)
        .in('post_id', postIds)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      const latest: Record<string, ForumComment | null> = {};
      const counts: Record<string, number> = {};

      (commentsData as ForumComment[] | null)?.forEach((comment) => {
        counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
        if (!latest[comment.post_id]) {
          latest[comment.post_id] = comment;
        }
      });

      postIds.forEach((id) => {
        if (latest[id] === undefined) {
          latest[id] = null;
        }
        if (counts[id] === undefined) {
          counts[id] = 0;
        }
      });

      setLatestComments((prev) => ({ ...prev, ...latest }));
      setCommentCounts((prev) => ({ ...prev, ...counts }));

      const { data: reactionsData, error: reactionsError } = await supabase
        .from('forum_reactions')
        .select('post_id, emotion')
        .in('post_id', postIds);

      if (reactionsError) throw reactionsError;

      const reactionMap: Record<string, ReactionSummary> = {};

      const reactionRows = (reactionsData as { post_id: string; emotion: EmotionKey }[] | null) ?? [];

      reactionRows.forEach((reaction) => {
        if (!reactionMap[reaction.post_id]) {
          reactionMap[reaction.post_id] = createEmptyReactionSummary();
        }
        reactionMap[reaction.post_id][reaction.emotion] += 1;
      });

      postIds.forEach((id) => {
        if (!reactionMap[id]) {
          reactionMap[id] = createEmptyReactionSummary();
        }
      });

      setReactionSummaries((prev) => ({ ...prev, ...reactionMap }));
    } catch (error) {
      console.error('Error fetching post metadata:', error);
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
      setComments((data as ForumComment[]) || []);
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

        if (data.user && data.session) {
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
      setAuthMode('login');
      await checkUser();
      await fetchPosts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSelectedPost(null);
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
      await fetchPosts();
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
      await fetchComments(selectedPost.id);
      void loadPostMeta([selectedPost.id]);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCommentTap = (event: React.MouseEvent, post: ForumPost) => {
    event.stopPropagation();

    if (!user) {
      openAuthModal('login');
      return;
    }

    setSelectedPost(post);
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const categories = ['Trao đổi lịch sử', 'Cảm nhận cá nhân', 'Bài nghiên cứu'];

  return (
    <div className="min-h-screen bg-brand-base pt-0">
      <div
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(47, 58, 69, 0.6), rgba(47, 58, 69, 0.75)), url(https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">
              DIỄN ĐÀN
            </h1>
            <p className="text-xl text-brand-sand font-serif italic">
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
                  className="flex items-center space-x-2 px-6 py-3 bg-brand-blue text-white hover:bg-brand-blue-600 transition-all duration-300 shadow-soft hover:shadow-medium"
                >
                  <Plus size={20} />
                  <span>Tạo Bài Viết</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span>Đăng Xuất</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center space-x-2 px-6 py-3 bg-brand-blue text-white hover:bg-brand-blue-600 transition-all duration-300 shadow-soft hover:shadow-medium"
              >
                <LogIn size={20} />
                <span>Đăng Nhập / Đăng Ký</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-brand-blue">
            <div className="animate-spin w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white border border-brand-blue/20 hover:border-brand-blue p-6 cursor-pointer transition-all duration-300 shadow-soft hover:shadow-medium"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-brand-text font-sans">
                        {post.user_profiles?.display_name || 'Anonymous'}
                      </p>
                      <p className="text-brand-muted text-xs">
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-brand-blue px-3 py-1 border border-brand-blue/50 bg-brand-sand/60">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-brand-text mb-3 hover:text-brand-blue transition-colors">
                  {post.title}
                </h3>
                <p className="text-brand-muted mb-4 line-clamp-2">{post.content}</p>

                <div className="bg-brand-sand/40 border border-brand-blue/10 p-4 mb-4">
                  <p className="text-xs uppercase tracking-wide text-brand-muted">Bình luận gần nhất</p>
                  {latestComments[post.id] ? (
                    <>
                      <p className="text-brand-text text-sm mt-2 line-clamp-2">
                        {`"${latestComments[post.id]?.content}"`}
                      </p>
                      <p className="text-brand-muted text-xs mt-2">
                        — {latestComments[post.id]?.user_profiles?.display_name || 'Anonymous'} ·{' '}
                        {latestComments[post.id]?.created_at
                          ? new Date(latestComments[post.id]!.created_at).toLocaleDateString('vi-VN')
                          : ''}
                      </p>
                    </>
                  ) : (
                    <p className="text-brand-muted text-sm mt-2">Chưa có bình luận nào.</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-5 text-brand-muted text-sm">
                  {EMOTION_KEYS.map((emotion) => {
                    const IconComponent = EMOTION_CONFIG[emotion].icon;
                    const count = reactionSummaries[post.id]?.[emotion] ?? 0;

                    return (
                      <div key={emotion} className="flex items-center space-x-2">
                        <IconComponent size={16} />
                        <span>
                          {EMOTION_CONFIG[emotion].label}: {count}
                        </span>
                      </div>
                    );
                  })}
                  <button
                    onClick={(event) => handleCommentTap(event, post)}
                    className="flex items-center space-x-2 text-brand-blue hover:text-brand-text transition-colors"
                    type="button"
                  >
                    <MessageSquare size={16} />
                    <span>{commentCounts[post.id] ?? 0} bình luận</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-brand-text/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-brand-blue max-w-md w-full p-8 shadow-medium">
            <h2 className="text-3xl font-serif text-brand-text mb-6">
              {authMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-brand-text mb-2">Tên Hiển Thị</label>
                  <input
                    type="text"
                    value={authForm.displayName}
                    onChange={(e) => setAuthForm({ ...authForm, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-brand-text mb-2">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-text mb-2">Mật Khẩu</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-blue text-white hover:bg-brand-blue-600 transition-all duration-300"
              >
                {authMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="w-full text-brand-blue hover:text-brand-muted transition-colors"
              >
                {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full text-brand-muted hover:text-brand-text transition-colors"
              >
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}

      {showNewPostModal && (
        <div className="fixed inset-0 bg-brand-text/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-brand-blue max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-medium">
            <h2 className="text-3xl font-serif text-brand-text mb-6">Tạo Bài Viết Mới</h2>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-brand-text mb-2">Danh Mục</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-brand-text mb-2">Tiêu Đề</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-text mb-2">Nội Dung</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none resize-none"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-blue text-white hover:bg-brand-blue-600 transition-all duration-300"
                >
                  Đăng Bài
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 py-3 border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 bg-brand-text/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-brand-blue max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-medium">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-brand-text font-sans">
                      {selectedPost.user_profiles?.display_name || 'Anonymous'}
                    </p>
                    <p className="text-brand-muted text-sm">
                      {new Date(selectedPost.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-brand-muted hover:text-brand-blue transition-colors"
                >
                  ✕
                </button>
              </div>

              <span className="inline-block text-xs text-brand-blue px-3 py-1 border border-brand-blue/50 bg-brand-sand/60 mb-4">
                {selectedPost.category}
              </span>

              <h2 className="text-3xl font-serif text-brand-text mb-4">{selectedPost.title}</h2>
              <p className="text-brand-muted leading-relaxed mb-8 whitespace-pre-wrap">
                {selectedPost.content}
              </p>

              <div className="border-t border-brand-blue/20 pt-6">
                <h3 className="text-xl font-serif text-brand-text mb-4">Bình Luận</h3>

                <div className="flex flex-wrap gap-4 text-brand-muted text-sm mb-6">
                  {EMOTION_KEYS.map((emotion) => {
                    const IconComponent = EMOTION_CONFIG[emotion].icon;
                    const count = reactionSummaries[selectedPost.id]?.[emotion] ?? 0;

                    return (
                      <div key={emotion} className="flex items-center space-x-2">
                        <IconComponent size={16} />
                        <span>
                          {EMOTION_CONFIG[emotion].label}: {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {user ? (
                  <form onSubmit={handleAddComment} className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none resize-none mb-2"
                      required
                    />
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-brand-blue text-white hover:bg-brand-blue-600 transition-all duration-300"
                    >
                      <Send size={16} />
                      <span>Gửi</span>
                    </button>
                  </form>
                ) : (
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-brand-blue/30 bg-brand-sand/40">
                    <p className="text-brand-text text-sm">
                      Đăng nhập để tham gia thảo luận và bày tỏ cảm xúc của bạn với cộng đồng.
                    </p>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="px-6 py-2 bg-brand-blue text-white hover:bg-brand-blue-600 transition-all duration-300"
                      type="button"
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-brand-blue/50 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="text-brand-text text-sm">
                            {comment.user_profiles?.display_name || 'Anonymous'}
                          </p>
                          <p className="text-brand-muted text-xs">
                            {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <p className="text-brand-muted text-sm">{comment.content}</p>
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
