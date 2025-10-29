import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { paymentService, PaymentMethod } from '../lib/paymentService'
import { localAuth } from '../lib/localAuth'
import { mockProducts } from '../data/mockShop'
import { CreditCard, Wallet, Building2, Truck, MapPin, Phone, User } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

export default function Checkout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  })
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCheckoutData()
  }, [])

  const loadCheckoutData = async () => {
    setLoading(true)
    const productId = searchParams.get('productId')
    const qtyParam = searchParams.get('quantity')
    const resolvedQuantity = qtyParam ? parseInt(qtyParam, 10) : 1
    try {

      if (!productId) {
        navigate('/shop')
        return
      }

      let resolvedProduct: Product | null = null

      if (isSupabaseConfigured) {
        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (productData) {
          resolvedProduct = productData as Product
        }
      } else {
        resolvedProduct = mockProducts.find(item => item.id === productId) ?? null
      }

      if (!resolvedProduct) {
        navigate('/shop')
        return
      }

      setProduct(resolvedProduct)
      setQuantity(resolvedQuantity)

      const methods = await paymentService.getPaymentMethods()
      setPaymentMethods(methods)
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id)
      }

      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (profile && profile.metadata) {
            setShippingInfo({
              fullName: profile.metadata.fullName || '',
              phone: profile.metadata.phone || '',
              address: profile.metadata.address || '',
              city: profile.metadata.city || '',
              district: profile.metadata.district || '',
              ward: profile.metadata.ward || ''
            })
          }
        }
      } else {
        const currentUser = localAuth.getCurrentUser()
        if (currentUser) {
          const saved = paymentService.getSavedShippingAddress(currentUser.id)
          if (saved) {
            setShippingInfo(saved)
          }
        }
      }
    } catch (error) {
      console.error('Error loading checkout data:', error)
      if (!isSupabaseConfigured) {
        const fallbackProduct = productId ? mockProducts.find(item => item.id === productId) ?? null : null
        if (fallbackProduct) {
          setProduct(fallbackProduct)
        }
      }
      setQuantity(resolvedQuantity)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^[0-9]{10,11}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }
    if (!shippingInfo.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ'
    if (!shippingInfo.city.trim()) newErrors.city = 'Vui lòng chọn Tỉnh/Thành phố'
    if (!shippingInfo.district.trim()) newErrors.district = 'Vui lòng chọn Quận/Huyện'
    if (!shippingInfo.ward.trim()) newErrors.ward = 'Vui lòng chọn Phường/Xã'
    if (!selectedPaymentMethod) newErrors.payment = 'Vui lòng chọn phương thức thanh toán'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !product) return

    setLoading(true)
    try {
      // Create order
      const orderId = await paymentService.createOrder({
        product_id: product.id,
        quantity,
        shipping_address: shippingInfo,
        notes,
        payment_method_id: selectedPaymentMethod
      })

      // Initiate payment
      const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod)
      const paymentResult = await paymentService.initiatePayment(orderId, selectedMethod!.type)

      if (paymentResult.success) {
        if (paymentResult.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = paymentResult.paymentUrl
        } else {
          // COD or other methods
          navigate(`/order-details?orderId=${orderId}`)
        }
      } else {
        alert(paymentResult.error || 'Có lỗi xảy ra khi thanh toán')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'vnpay':
      case 'momo':
        return <Wallet className="w-5 h-5" />
      case 'bank_transfer':
        return <Building2 className="w-5 h-5" />
      case 'cod':
        return <Truck className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  const totalAmount = product.price * quantity

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Thông tin giao hàng
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0123456789"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Số nhà, tên đường"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="TP. Hồ Chí Minh"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Quận 1"
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.ward}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.ward ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Phường Bến Nghé"
                    />
                    {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Ghi chú cho người bán..."
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      {getPaymentIcon(method.type)}
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.payment && <p className="text-red-500 text-sm mt-2">{errors.payment}</p>}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>

              <div className="flex gap-4 mb-4 pb-4 border-b">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600">Số lượng: {quantity}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
