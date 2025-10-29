import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { paymentService } from '../lib/paymentService'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [orderId, setOrderId] = useState<string>('')

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    try {
      // VNPay return parameters
      const params: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        params[key] = value
      })

      if (params.vnp_TxnRef) {
        // VNPay
        const success = await paymentService.verifyVNPayReturn(params)
        setOrderId(params.vnp_TxnRef)
        setStatus(success ? 'success' : 'failed')
      } else if (params.orderId) {
        // Momo or other
        setOrderId(params.orderId)
        if (params.resultCode === '0') {
          await paymentService.recordPaymentSuccess(params.orderId, 'momo', params)
          setStatus('success')
        } else {
          setStatus('failed')
        }
      } else {
        setStatus('failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setStatus('failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Đang xác thực thanh toán</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">
              Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.
            </p>
            <button
              onClick={() => navigate(`/order-details?orderId=${orderId}`)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
            >
              Xem chi tiết đơn hàng
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại</h2>
            <p className="text-gray-600 mb-6">
              Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Quay lại cửa hàng
            </button>
          </>
        )}
      </div>
    </div>
  )
}
