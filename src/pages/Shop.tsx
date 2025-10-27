import { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { supabase, type Product } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);

  useScrollAnimation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setSelectedProduct(null);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, product) => sum + product.price, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-vietnam-black pt-20">
      <div className="relative h-80 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg)',
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-vietnam-white mb-4">
              SHOP
            </h1>
            <p className="text-xl text-vietnam-gold font-serif italic">
              Sưu tầm di sản lịch sử
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCart(true)}
          className="absolute top-8 right-8 bg-vietnam-red text-vietnam-white p-4 rounded-full hover:bg-vietnam-red/90 transition-all duration-300 hover:shadow-lg hover:shadow-vietnam-red/50"
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-vietnam-gold text-vietnam-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center text-vietnam-white">
            <div className="animate-spin w-12 h-12 border-4 border-vietnam-red border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden bg-vietnam-black border border-vietnam-red/30 hover:border-vietnam-red transition-all duration-300 cursor-pointer fade-scroll"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vietnam-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="text-xs text-vietnam-gold mb-2 uppercase tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-serif text-vietnam-white mb-2 group-hover:text-vietnam-red transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-vietnam-white/70 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif text-vietnam-red">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-4 py-2 bg-vietnam-red text-vietnam-white text-sm uppercase tracking-wider hover:bg-vietnam-gold hover:text-vietnam-black transition-all duration-300"
                    >
                      Mua Ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-vietnam-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-vietnam-black border-2 border-vietnam-red max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-vietnam-white hover:text-vietnam-red transition-colors z-10"
              >
                <X size={32} />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div>
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="text-xs text-vietnam-gold mb-2 uppercase tracking-wider">
                    {selectedProduct.category}
                  </div>
                  <h2 className="text-3xl font-serif text-vietnam-white mb-4">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-vietnam-white/70 mb-6 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="text-4xl font-serif text-vietnam-red mb-6">
                    {formatPrice(selectedProduct.price)}
                  </div>
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="w-full py-4 bg-vietnam-red text-vietnam-white text-lg uppercase tracking-wider hover:bg-vietnam-gold hover:text-vietnam-black transition-all duration-300"
                  >
                    Thêm Vào Giỏ Hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-vietnam-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-vietnam-black border-2 border-vietnam-red max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-serif text-vietnam-white">Giỏ Hàng</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-vietnam-white hover:text-vietnam-red transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-vietnam-white/70 text-center py-8">
                  Giỏ hàng của bạn đang trống
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-vietnam-red/30 pb-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover"
                          />
                          <div>
                            <h3 className="text-vietnam-white font-serif">{product.name}</h3>
                            <p className="text-vietnam-red">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-vietnam-white/50 hover:text-vietnam-red transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-vietnam-red pt-4 mb-6">
                    <div className="flex items-center justify-between text-2xl font-serif">
                      <span className="text-vietnam-white">Tổng Cộng:</span>
                      <span className="text-vietnam-red">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-vietnam-red text-vietnam-white text-lg uppercase tracking-wider hover:bg-vietnam-gold hover:text-vietnam-black transition-all duration-300">
                    Thanh Toán
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
