import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { paymentService } from '../lib/paymentService'
import { Package, MapPin, Phone, CreditCard, Truck, CheckCircle, Star } from 'lucide-react'

interface OrderDetails {
  id: string
  status: string
  payment_status: string
  total_amount: number
  quantity: number
  shipping_address: any
  notes: string
  created_at: string
  confirmed_at: string
  shipped_at: string
  delivered_at: string
  logistics_provider?: string
  products: {
    id: string
    name: string
    price: number
    image_url: string
    seller_id: string
  }
  payment_methods: {
    name: string
    type: string
  }
  order_status_history: Array<{
    status: string
    notes: string
    created_at: string
  }>
}

export default function OrderDetails() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    loadOrderDetails()
  }, [])

  const loadOrderDetails = async () => {
    try {
      const orderId = searchParams.get('orderId')
      if (!orderId) {
        navigate('/shop')
        return
      }

      const orderData = await paymentService.getOrderDetails(orderId)
      setOrder(orderData)
    } catch (error) {
      console.error('Error loading order:', error)
      alert('Không thể tải thông tin đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Package },
      buyer_confirmed: { label: 'Người mua xác nhận', color: 'bg-sky-100 text-sky-800', icon: CheckCircle },
      seller_confirmed: { label: 'Người bán xác nhận', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800', icon: Package },
      shipping: { label: 'Đang giao hàng', color: 'bg-orange-100 text-orange-800', icon: Truck },
      delivered: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: Package },
      refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800', icon: Package }
    }
    return statusMap[status] || statusMap.pending
  }

  const getPaymentStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      unpaid: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Không tìm thấy đơn hàng</div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color} flex items-center gap-2`}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </span>
          </div>
          <p className="text-gray-600 text-sm">Mã đơn hàng: {order.id}</p>
          <p className="text-gray-600 text-sm">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
              <div className="flex gap-4">
                <img
                  src={order.products.image_url}
                  alt={order.products.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{order.products.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">Số lượng: {order.quantity}</p>
                  <p className="text-blue-600 font-semibold">
                    {order.products.price.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Địa chỉ giao hàng
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shipping_address.fullName}</p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {order.shipping_address.phone}
                </p>
                <p className="text-gray-600">
                  {order.shipping_address.address}, {order.shipping_address.ward},{' '}
                  {order.shipping_address.district}, {order.shipping_address.city}
                </p>
              </div>
              {order.logistics_provider && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  Đơn vị vận chuyển: {order.logistics_provider}
                </div>
              )}
              {order.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ghi chú:</span> {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h2>
              <div className="space-y-4">
                {order.order_status_history
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((history, index) => {
                    const historyStatusInfo = getStatusInfo(history.status)
                    const HistoryIcon = historyStatusInfo.icon
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full ${historyStatusInfo.color} flex items-center justify-center`}>
                            <HistoryIcon className="w-5 h-5" />
                          </div>
                          {index < order.order_status_history.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium">{historyStatusInfo.label}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(history.created_at).toLocaleString('vi-VN')}
                          </p>
                          {history.notes && (
                            <p className="text-sm text-gray-500 mt-1">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thanh toán
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">{order.payment_methods.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${
                    order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{(order.products.price * order.quantity).toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{order.total_amount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {order.status === 'delivered' && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Đánh giá sản phẩm
                </button>
              )}
              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Quay lại cửa hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal - Simple placeholder, will be enhanced later */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h3>
            <p className="text-gray-600 mb-4">Tính năng đánh giá đang được phát triển...</p>
            <button
              onClick={() => setShowReviewModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
