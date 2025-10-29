import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, Star, Bell } from 'lucide-react';
import { supabase, isSupabaseConfigured, type Product, type ProductReview, type SellerChat } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';
import { paymentService } from '../lib/paymentService';
import { mockProducts, mockProductReviews, mockChatThreads, type MockReview, type MockChatMessage } from '../data/mockShop';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type ReviewRecord = ProductReview | MockReview;
type ChatRecord =
  | SellerChat
  | MockChatMessage
  | {
      id: string;
      product_id: string;
      message: string;
      created_at: string;
      user_id?: string;
      author?: string;
    };

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(null);
  const [orderedProductIds, setOrderedProductIds] = useState<Set<string>>(new Set());
  const [reviews, setReviews] = useState<Record<string, ReviewRecord[]>>({});
  const [showChatFor, setShowChatFor] = useState<Product | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatRecord[]>>({});
  const [chatDrafts, setChatDrafts] = useState<Record<string, string>>({});
  const [usingMockData, setUsingMockData] = useState(false);
  const [isChatDockVisible, setIsChatDockVisible] = useState(false);
  const [unreadChats, setUnreadChats] = useState<Record<string, number>>({});
  const [lastSeenChat, setLastSeenChat] = useState<Record<string, string>>({});

  const fetchChatRef = useRef<(productId: string, options?: { forceMock?: boolean }) => Promise<void>>(async () => {});
  const chatMessagesRef = useRef(chatMessages);

  useScrollAnimation();

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);


  const redirectToLogin = () => {
    navigate('/login', { state: { from: '/shop' } });
  };

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  useEffect(() => {
    // If arrived after login with an action, perform it
    const after = sessionStorage.getItem('afterLogin');
    if (after && user) {
      try {
        const payload = JSON.parse(after) as { action?: string; productId?: string; page?: string };
        if (payload.page !== 'shop') {
          return;
        }

        sessionStorage.removeItem('afterLogin');

        if (payload.productId) {
          const product = products.find((item) => item.id === payload.productId);
          if (product) {
            if (payload.action === 'buyNow') {
              handleBuyNow(product);
            } else if (payload.action === 'chat') {
              openChat(product);
            }
          }
        }
      } catch (err) {
        // ignore malformed payloads
      }
    }
  }, [user, products]);

  useEffect(() => {
    if (!user) {
      setOrderedProductIds(new Set());
      return;
    }
    fetchOrders();
  }, [user]);

  const checkUser = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.warn('Không thể lấy thông tin người dùng Supabase:', error.message);
        } else if (data?.user) {
          setUser(data.user);
          return;
        }
      } catch (error) {
        console.warn('Supabase auth không khả dụng, chuyển sang local auth.', error);
      }
    }

    const localUser = localAuth.getCurrentUser();
    setUser(localUser ?? null);
  };

  const applyMockShopData = () => {
    setUsingMockData(true);
    setProducts(mockProducts);
    const grouped: Record<string, ReviewRecord[]> = {};
    mockProducts.forEach((product) => {
      grouped[product.id] = mockProductReviews.filter((review) => review.product_id === product.id);
    });
    setReviews(grouped);

    const initialChats: Record<string, ChatRecord[]> = {};
    Object.entries(mockChatThreads).forEach(([productId, messages]) => {
      initialChats[productId] = messages;
    });
    setChatMessages(initialChats);
    setChatDrafts({});

    const initialUnread: Record<string, number> = {};
    Object.entries(initialChats).forEach(([productId, list]) => {
      const unread = list.filter((message) => isSellerMessage(message)).length;
      if (unread > 0) {
        initialUnread[productId] = unread;
      }
    });
    setUnreadChats(initialUnread);
    setLastSeenChat({});
  };

  const fetchProducts = async () => {
    setLoading(true);
    setReviews({});
    setChatMessages({});
    setChatDrafts({});
    setUnreadChats({});
    setLastSeenChat({});
    setIsChatDockVisible(false);
    setShowChatFor(null);

    if (!isSupabaseConfigured) {
      applyMockShopData();
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typed = (data ?? []) as Product[];
      if (!typed.length) {
        applyMockShopData();
        return;
      }

      setUsingMockData(false);
      setProducts(typed);
      typed.forEach((product) => fetchReviews(product.id));
    } catch (error) {
      console.error('Error fetching products:', error);
      applyMockShopData();
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const orders = await paymentService.getUserOrders();
      const ids = new Set<string>((orders || []).map((order: any) => String(order.product_id)));
      setOrderedProductIds(ids);
    } catch (err) {
      console.warn('Không thể tải lịch sử đơn hàng của bạn.', err);
      setOrderedProductIds(new Set());
    }
  };

  const fetchReviews = async (productId: string, options: { forceMock?: boolean } = {}) => {
    if (options.forceMock || !isSupabaseConfigured) {
      const fallback = mockProductReviews.filter((review) => review.product_id === productId);
      setReviews((prev) => ({ ...prev, [productId]: fallback }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId);

      if (error) throw error;
      setReviews((prev) => ({ ...prev, [productId]: ((data as ProductReview[]) ?? []) }));
    } catch (err) {
      const fallback = mockProductReviews.filter((review) => review.product_id === productId);
      if (fallback.length) {
        setReviews((prev) => ({ ...prev, [productId]: fallback }));
      }
    }
  };

  const fetchChat = async (productId: string, options: { forceMock?: boolean } = {}) => {
    if (options.forceMock || !isSupabaseConfigured) {
      const existing = chatMessagesRef.current[productId];
      const base = mockChatThreads[productId] ?? [];
      const list = existing && existing.length ? existing : base;
      updateChatStore(productId, list);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('seller_chats')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      const list = ((data as SellerChat[]) ?? []) as ChatRecord[];
      updateChatStore(productId, list);
    } catch (err) {
      if (mockChatThreads[productId]) {
        updateChatStore(productId, mockChatThreads[productId]);
      }
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const isSellerMessage = (message: ChatRecord) => {
    if ('author' in message && message.author) {
      return message.author !== 'buyer';
    }
    if ('user_id' in message && message.user_id) {
      return message.user_id !== user?.id;
    }
    return true;
  };

  const markChatAsRead = (productId: string, messages: ChatRecord[]) => {
    const latest = messages.reduce<string | undefined>((acc, message) => {
      if (!message.created_at) return acc;
      if (!acc) return message.created_at;
      return new Date(message.created_at).getTime() > new Date(acc).getTime() ? message.created_at : acc;
    }, undefined);

    setUnreadChats((prev) => {
      if (!prev[productId]) return prev;
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    if (latest) {
      setLastSeenChat((prev) => ({ ...prev, [productId]: latest }));
    }
  };

  const updateUnreadCount = (productId: string, messages: ChatRecord[]) => {
    const lastSeen = lastSeenChat[productId];
    const unread = messages.filter((message) => {
      if (!isSellerMessage(message)) return false;
      if (!message.created_at) return !lastSeen;
      if (!lastSeen) return true;
      return new Date(message.created_at).getTime() > new Date(lastSeen).getTime();
    }).length;

    setUnreadChats((prev) => {
      if (unread === 0) {
        if (!prev[productId]) return prev;
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: unread };
    });
  };

  const updateChatStore = (productId: string, list: ChatRecord[]) => {
    setChatMessages((prev) => ({ ...prev, [productId]: list }));
    if (isChatDockVisible && showChatFor?.id === productId) {
      markChatAsRead(productId, list);
    } else {
      updateUnreadCount(productId, list);
    }
  };

  const totalUnreadMessages = Object.values(unreadChats).reduce((sum, count) => sum + count, 0);
  const activeChatMessages = showChatFor ? chatMessages[showChatFor.id] ?? [] : [];

  const handleBuyNow = async (product: Product) => {
    if (!user) {
      sessionStorage.setItem('afterLogin', JSON.stringify({ action: 'buyNow', productId: product.id, page: 'shop' }));
      redirectToLogin();
      return;
    }

    // Navigate to checkout page with product info
    const checkoutUrl = `/checkout?productId=${product.id}&quantity=1`;
    window.location.href = checkoutUrl;
  };

  const openChat = (product: Product) => {
    if (!user) {
      sessionStorage.setItem('afterLogin', JSON.stringify({ action: 'chat', productId: product.id, page: 'shop' }));
      redirectToLogin();
      return;
    }
    setShowChatFor(product);
    setIsChatDockVisible(true);
    const existingMessages = chatMessages[product.id] ?? [];
    if (existingMessages.length) {
      markChatAsRead(product.id, existingMessages);
    }
    fetchChat(product.id, { forceMock: usingMockData });
  };

  const resolveProductById = (productId: string): Product | null => {
    if (showChatFor?.id === productId && showChatFor) {
      return showChatFor;
    }
    const fromLoaded = products.find((item) => item.id === productId);
    if (fromLoaded) return fromLoaded;
    const fromMock = mockProducts.find((item) => item.id === productId);
    return fromMock ?? null;
  };

  const handleNotificationClick = () => {
    if (totalUnreadMessages > 0) {
      const targetId = Object.entries(unreadChats).find(([, count]) => count > 0)?.[0];
      if (targetId) {
        const targetProduct = products.find((item) => item.id === targetId) ?? resolveProductById(targetId);
        if (targetProduct) {
          openChat(targetProduct);
          return;
        }
      }
    }

    if (showChatFor) {
      if (!isChatDockVisible) {
        setIsChatDockVisible(true);
        if (activeChatMessages.length) {
          markChatAsRead(showChatFor.id, activeChatMessages);
        }
      }
      return;
    }

    if (products.length) {
      openChat(products[0]);
    }
  };

  const chatTabs = useMemo(() => {
    const ids = new Set<string>();
    if (showChatFor?.id) ids.add(showChatFor.id);
    Object.keys(chatMessages).forEach((id) => ids.add(id));
    Object.keys(unreadChats).forEach((id) => ids.add(id));

    return Array.from(ids)
      .map((id) => {
        const product = resolveProductById(id);
        if (!product) return null;
        return {
          id,
          product,
          name: product.name,
          unread: unreadChats[id] ?? 0,
        };
      })
      .filter((entry): entry is { id: string; product: Product; name: string; unread: number } => Boolean(entry));
  }, [showChatFor, chatMessages, unreadChats, products, usingMockData]);

  const handleSelectChatTab = (productId: string) => {
    const product = resolveProductById(productId);
    if (!product) return;
    openChat(product);
  };

  useEffect(() => {
    fetchChatRef.current = fetchChat;
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const channel = supabase
      .channel('shop-chat-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'seller_chats' }, (payload) => {
        const message = payload.new as SellerChat | null;
        if (!message?.product_id) return;
        void fetchChatRef.current(String(message.product_id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isSupabaseConfigured]);

  const getReviewSummary = (productId: string) => {
    const list = reviews[productId];
    if (!list || list.length === 0) return null;
    const total = list.reduce((sum, review) => sum + (review?.rating ?? 0), 0);
    const average = Math.round((total / list.length) * 10) / 10;
    return { average, count: list.length };
  };

  const resolveReviewAuthor = (review: ReviewRecord) => {
    if ('author' in review && review.author) {
      if (review.author === 'buyer') return 'Bạn';
      if (review.author === 'seller') return 'Người bán';
      return review.author;
    }
    if ('user_id' in review && review.user_id) {
      return review.user_id === user?.id ? 'Bạn' : 'Người mua';
    }
    return null;
  };

  const formatReviewTimestamp = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
  };

  const resolveChatSender = (message: ChatRecord) => {
    if ('author' in message && message.author) {
      if (message.author === 'buyer') return 'Bạn';
      if (message.author === 'seller') return 'Người bán';
      return message.author;
    }
    if ('user_id' in message && message.user_id) {
      return message.user_id === user?.id ? 'Bạn' : 'Người bán';
    }
    return 'Khách';
  };

  const formatChatTimestamp = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  };

  const sendChatMessage = async (productId: string) => {
    const draft = (chatDrafts[productId] ?? '').trim();
    if (!draft) return;

    if (!user) {
      sessionStorage.setItem('afterLogin', JSON.stringify({ action: 'chat', productId, page: 'shop' }));
      redirectToLogin();
      return;
    }

    if (!isSupabaseConfigured) {
      const newMessage: ChatRecord = {
        id: `local-${Date.now()}`,
        product_id: productId,
        author: 'buyer',
        message: draft,
        created_at: new Date().toISOString(),
        user_id: user.id,
      };
      const updatedHistory = [...(chatMessages[productId] ?? []), newMessage];
      setChatMessages((prev) => ({ ...prev, [productId]: updatedHistory }));
      markChatAsRead(productId, updatedHistory);
      setChatDrafts((prev) => ({ ...prev, [productId]: '' }));
      return;
    }

    try {
      const { error } = await supabase.from('seller_chats').insert({
        product_id: productId,
        user_id: user.id,
        message: draft,
      });
      if (error) throw error;
      setChatDrafts((prev) => ({ ...prev, [productId]: '' }));
      await fetchChat(productId);
    } catch (err: any) {
      alert('Không gửi được — ' + (err?.message ?? 'lỗi không xác định'));
    }
  };

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const terms = search.trim().toLowerCase().split(/\s+/);
    const name = p.name.toLowerCase();
    return terms.every((t) => name.includes(t));
  });

  const selectedSummary = selectedProduct ? getReviewSummary(selectedProduct.id) : null;

  return (
    <div className="min-h-screen bg-brand-base pt-0">
      <div className="relative h-80 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(47, 58, 69, 0.6), rgba(47, 58, 69, 0.75)), url(https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg)',
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">SHOP</h1>
            <p className="text-xl text-brand-sand font-serif italic">Sưu tầm di sản lịch sử</p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm theo tên (ví dụ: 'Áo', 'Sách')"
            className="w-full px-4 py-3 border border-brand-blue/20 bg-white outline-none md:flex-1"
          />
          {user && (
            <button
              type="button"
              onClick={handleNotificationClick}
              className="inline-flex items-center gap-2 self-start rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white md:self-auto"
            >
              <Bell className="h-4 w-4" />
              <span>Tin nhắn</span>
              {totalUnreadMessages > 0 && (
                <span className="ml-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-blue text-xs font-semibold text-white">
                  {totalUnreadMessages}
                </span>
              )}
            </button>
          )}
        </div>

        {usingMockData && (
          <div className="mb-8 rounded border border-dashed border-brand-blue/40 bg-brand-sand/40 px-4 py-3 text-sm text-brand-muted">
            Đang hiển thị dữ liệu minh hoạ vì chưa kết nối Supabase.
          </div>
        )}

        {loading ? (
          <div className="text-center text-brand-blue">
            <div className="animate-spin w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product) => {
              const summary = getReviewSummary(product.id);
              return (
                <div key={product.id} className="group relative overflow-hidden bg-white border border-brand-blue/20 hover:border-brand-blue transition-all duration-300 cursor-pointer fade-scroll" onClick={() => setSelectedProduct(product)}>
                <div className="relative h-64 overflow-hidden">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-text/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="text-xs text-brand-blue mb-2 uppercase tracking-wider">{product.category}</div>
                  <h3 className="text-xl font-serif text-brand-text mb-2 group-hover:text-brand-blue transition-colors">{product.name}</h3>
                  {product.seller_name && <p className="text-xs text-brand-muted mb-2">Người bán: {product.seller_name}</p>}
                  <p className="text-brand-muted text-sm mb-4 line-clamp-2">{product.description}</p>
                  {summary && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-brand-text">
                      <span className="flex items-center gap-1 text-brand-blue">
                        <Star className="w-4 h-4" fill="currentColor" />
                        <span>{summary.average.toFixed(1)}</span>
                      </span>
                      <span className="text-xs text-brand-muted">({summary.count} đánh giá)</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif text-brand-blue">{formatPrice(product.price)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="px-4 py-2 bg-brand-blue text-white text-sm uppercase tracking-wider hover:bg-brand-blue-600 transition-all duration-300"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(product);
                        }}
                        className="px-4 py-2 border border-brand-blue text-brand-blue text-sm uppercase tracking-wider hover:bg-brand-blue hover:text-white transition-all duration-300"
                      >
                        Mua
                      </button>
                    </div>
                  </div>
                  {orderedProductIds.has(product.id) && <div className="mt-3 text-sm text-green-700">Bạn đã mua sản phẩm này trước đây</div>}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-brand-text/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-brand-blue max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-brand-muted hover:text-brand-blue transition-colors z-10"><X size={32} /></button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div>
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-96 object-cover" />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="text-xs text-brand-blue mb-2 uppercase tracking-wider">{selectedProduct.category}</div>
                  <h2 className="text-3xl font-serif text-brand-text mb-4">{selectedProduct.name}</h2>
                  <p className="text-brand-muted mb-6 leading-relaxed">{selectedProduct.description}</p>
                  <div className="text-4xl font-serif text-brand-blue mb-4">{formatPrice(selectedProduct.price)}</div>

                  {selectedSummary && (
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex items-center gap-2 text-brand-blue">
                        <Star className="w-6 h-6" fill="currentColor" />
                        <span className="text-3xl font-serif">{selectedSummary.average.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-brand-muted">Tổng {selectedSummary.count} đánh giá</span>
                    </div>
                  )}

                  {(selectedProduct.seller_name || selectedProduct.seller_title || selectedProduct.seller_location || selectedProduct.seller_contact) && (
                    <div className="mb-6 border border-brand-blue/20 bg-brand-sand/40 p-4">
                      <h4 className="font-serif text-lg text-brand-text mb-2">Thông tin người bán</h4>
                      <div className="space-y-1 text-sm text-brand-muted">
                        {selectedProduct.seller_name && <p><span className="text-brand-text">Tên: </span>{selectedProduct.seller_name}</p>}
                        {selectedProduct.seller_title && <p><span className="text-brand-text">Chuyên môn: </span>{selectedProduct.seller_title}</p>}
                        {selectedProduct.seller_location && <p><span className="text-brand-text">Khu vực: </span>{selectedProduct.seller_location}</p>}
                        {selectedProduct.seller_contact && <p><span className="text-brand-text">Liên hệ: </span>{selectedProduct.seller_contact}</p>}
                      </div>
                      {usingMockData && <p className="mt-3 text-xs text-brand-muted/80">Dữ liệu minh hoạ cho trải nghiệm demo.</p>}
                    </div>
                  )}

                  <div className="flex gap-3 mb-4">
                    <button onClick={() => handleBuyNow(selectedProduct)} className="px-6 py-3 bg-brand-blue text-white">Mua ngay</button>
                    <button onClick={() => openChat(selectedProduct)} className="px-4 py-3 bg-brand-sand text-brand-text flex items-center gap-2"><MessageSquare /> Chat người bán</button>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-serif text-lg mb-3">Đánh giá & bình luận</h4>
                    {!(reviews[selectedProduct.id]?.length) ? (
                      <p className="text-brand-muted">Chưa có đánh giá nào.</p>
                    ) : (
                      <div className="space-y-3">
                        {(reviews[selectedProduct.id] || []).map((r) => {
                          const authorLabel = resolveReviewAuthor(r);
                          const timestamp = formatReviewTimestamp(r.created_at);
                          return (
                            <div key={r.id} className="rounded-lg border border-brand-blue/20 bg-white/80 p-4">
                              <div className="flex items-center justify-between text-xs text-brand-muted">
                                <span className="flex items-center gap-2 text-brand-text">
                                  <Star className="w-4 h-4" fill="currentColor" />
                                  <span>{r.rating}/5</span>
                                </span>
                                {timestamp && <span>{timestamp}</span>}
                              </div>
                              <p className="mt-3 text-sm text-brand-text leading-relaxed whitespace-pre-line">{r.comment}</p>
                              {authorLabel && <div className="mt-2 text-xs text-brand-muted italic">— {authorLabel}</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChatFor && isChatDockVisible && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-fade-in">
          <div className="rounded-2xl border-2 border-brand-blue bg-white shadow-2xl">
            <div className="flex">
              {chatTabs.length > 0 && (
                <div className="flex w-20 flex-col items-center gap-3 border-r border-brand-blue/10 bg-brand-base/20 px-3 py-4">
                  {chatTabs.map((tab) => {
                    const isActive = showChatFor?.id === tab.id;
                    const thumbnail = tab.product.image_url || 'https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg';
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleSelectChatTab(tab.id)}
                        className={`relative h-12 w-12 overflow-hidden rounded-full border transition ${
                          isActive ? 'border-brand-blue ring-2 ring-brand-blue/40' : 'border-brand-blue/30 hover:border-brand-blue'
                        }`}
                        title={tab.name}
                        aria-label={`Chat với ${tab.name}`}
                      >
                        <img src={thumbnail} alt={tab.name} className="h-full w-full object-cover" />
                        {tab.unread > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.1rem] items-center justify-center rounded-full bg-brand-blue text-[10px] font-semibold text-white">
                            {tab.unread}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between border-b border-brand-blue/20 px-5 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-brand-blue">Chat người bán</p>
                    <h3 className="font-serif text-lg text-brand-text">{showChatFor.name}</h3>
                  </div>
                  <button onClick={() => setIsChatDockVisible(false)} className="text-brand-muted hover:text-brand-blue">
                    <X />
                  </button>
                </div>
                <div className="max-h-64 space-y-3 overflow-y-auto px-5 py-4">
              {activeChatMessages.length === 0 ? (
                <p className="py-6 text-center text-sm text-brand-muted">Chưa có tin nhắn nào. Hãy là người mở lời!</p>
              ) : (
                activeChatMessages.map((m) => {
                  const sender = resolveChatSender(m);
                  const timestamp = formatChatTimestamp(m.created_at);
                  return (
                    <div key={m.id} className="rounded-lg border border-brand-blue/20 bg-white/80 p-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-brand-muted">
                        <span className="font-semibold text-brand-text">{sender}</span>
                        {timestamp && <span>{timestamp}</span>}
                      </div>
                      <div className="text-sm text-brand-text leading-relaxed whitespace-pre-line">{m.message}</div>
                    </div>
                  );
                })
              )}
            </div>
                <div className="flex gap-2 border-t border-brand-blue/20 bg-brand-sand/30 px-5 py-4">
                  <input
                    className="flex-1 rounded border border-brand-blue/30 px-3 py-2"
                    placeholder="Nhắn tin..."
                    value={chatDrafts[showChatFor.id] ?? ''}
                    onChange={(e) => setChatDrafts((prev) => ({ ...prev, [showChatFor.id]: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => sendChatMessage(showChatFor.id)}
                    disabled={!((chatDrafts[showChatFor.id] ?? '').trim())}
                    className="px-4 py-2 bg-brand-blue text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
