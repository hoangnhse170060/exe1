import { supabase, isSupabaseConfigured } from './supabase'
import { localAuth } from './localAuth'
import { mockProducts } from '../data/mockShop'
import CryptoJS from 'crypto-js'

export interface PaymentMethod {
  id: string
  name: string
  type: 'vnpay' | 'momo' | 'bank_transfer' | 'cod'
  is_active: boolean
}

export interface CreateOrderData {
  product_id: string
  quantity: number
  shipping_address: {
    fullName: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
  }
  notes?: string
  payment_method_id: string
}

export interface PaymentResult {
  success: boolean
  paymentUrl?: string
  orderId?: string
  error?: string
}

// VNPay Configuration
const VNPAY_TMN_CODE = import.meta.env.VITE_VNPAY_TMN_CODE || 'DEMO'
const VNPAY_HASH_SECRET = import.meta.env.VITE_VNPAY_HASH_SECRET || 'DEMO_SECRET'
const VNPAY_URL = import.meta.env.VITE_VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
const VNPAY_RETURN_URL = `${window.location.origin}/payment-result`

// Momo Configuration
const MOMO_PARTNER_CODE = import.meta.env.VITE_MOMO_PARTNER_CODE || 'DEMO'
const MOMO_ACCESS_KEY = import.meta.env.VITE_MOMO_ACCESS_KEY || 'DEMO_KEY'
const MOMO_SECRET_KEY = import.meta.env.VITE_MOMO_SECRET_KEY || 'DEMO_SECRET'
const MOMO_URL = import.meta.env.VITE_MOMO_URL || 'https://test-payment.momo.vn/v2/gateway/api/create'
const MOMO_RETURN_URL = `${window.location.origin}/payment-result`
const MOMO_NOTIFY_URL = `${window.location.origin}/api/momo-notify`

const LOCAL_ORDERS_KEY = 'local_orders'
const LOCAL_PAYMENT_METHODS_KEY = 'local_payment_methods'
const LOCAL_SHIPPING_PREFIX = 'local_shipping_address_'

type LocalOrderHistoryEntry = {
  status: string
  notes: string
  created_at: string
}

type LocalOrder = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  shipping_address: CreateOrderData['shipping_address']
  notes?: string
  payment_method_id: string
  status: string
  payment_status: 'unpaid' | 'paid'
  total_amount: number
  created_at: string
  confirmed_at?: string
  shipped_at?: string
  delivered_at?: string
  logistics_provider?: string
  product_snapshot: {
    id: string
    name: string
    price: number
    image_url: string
  }
  payment_method_snapshot: PaymentMethod
  order_status_history: LocalOrderHistoryEntry[]
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', type: 'cod', is_active: true },
  { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', type: 'bank_transfer', is_active: true },
  { id: 'vnpay', name: 'VNPay QR', type: 'vnpay', is_active: true },
  { id: 'momo', name: 'Ví MoMo', type: 'momo', is_active: true }
]

const canUseLocalStorage = () => typeof window !== 'undefined' && !!window.localStorage

const readLocalOrders = (): LocalOrder[] => {
  if (!canUseLocalStorage()) return []
  const raw = window.localStorage.getItem(LOCAL_ORDERS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as LocalOrder[]
  } catch (error) {
    console.warn('Không thể đọc đơn hàng local:', error)
    return []
  }
}

const writeLocalOrders = (orders: LocalOrder[]) => {
  if (!canUseLocalStorage()) return
  window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders))
}

const ensureLocalPaymentMethods = (): PaymentMethod[] => {
  if (!canUseLocalStorage()) {
    return DEFAULT_PAYMENT_METHODS
  }
  const raw = window.localStorage.getItem(LOCAL_PAYMENT_METHODS_KEY)
  if (!raw) {
    window.localStorage.setItem(LOCAL_PAYMENT_METHODS_KEY, JSON.stringify(DEFAULT_PAYMENT_METHODS))
    return DEFAULT_PAYMENT_METHODS
  }
  try {
    const parsed = JSON.parse(raw) as PaymentMethod[]
    if (!parsed.length) {
      window.localStorage.setItem(LOCAL_PAYMENT_METHODS_KEY, JSON.stringify(DEFAULT_PAYMENT_METHODS))
      return DEFAULT_PAYMENT_METHODS
    }
    return parsed
  } catch (error) {
    console.warn('Không thể đọc phương thức thanh toán local:', error)
    window.localStorage.setItem(LOCAL_PAYMENT_METHODS_KEY, JSON.stringify(DEFAULT_PAYMENT_METHODS))
    return DEFAULT_PAYMENT_METHODS
  }
}

const saveLocalShippingAddress = (userId: string, address: CreateOrderData['shipping_address']) => {
  if (!canUseLocalStorage()) return
  window.localStorage.setItem(`${LOCAL_SHIPPING_PREFIX}${userId}`, JSON.stringify(address))
}

const getLocalShippingAddress = (userId: string) => {
  if (!canUseLocalStorage()) return null
  const raw = window.localStorage.getItem(`${LOCAL_SHIPPING_PREFIX}${userId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CreateOrderData['shipping_address']
  } catch (error) {
    console.warn('Không thể đọc địa chỉ giao hàng local:', error)
    return null
  }
}

const findProductSnapshot = (productId: string) => {
  return mockProducts.find(product => product.id === productId) ?? null
}

const appendHistory = (order: LocalOrder, status: string, notes: string, timestamp: string) => {
  order.order_status_history.push({ status, notes, created_at: timestamp })
}

const simulateLocalOrderProgress = (order: LocalOrder, paymentMethodType: string) => {
  const baseTimestamp = Date.now()
  const steps: Array<{ status: string; notes: string }> = [
    { status: 'buyer_confirmed', notes: 'Người mua đã xác nhận thanh toán thành công.' },
    { status: 'seller_confirmed', notes: 'Người bán đã xác nhận và chuẩn bị đơn hàng.' },
    { status: 'shipping', notes: 'Viettel Post đã tiếp nhận và đang vận chuyển đơn hàng.' },
    { status: 'delivered', notes: 'Bạn đã xác nhận đơn hàng thành công.' }
  ]

  steps.forEach((step, index) => {
    const timestamp = new Date(baseTimestamp + (index + 1) * 500).toISOString()
    order.status = step.status
    if (step.status === 'buyer_confirmed') {
      order.confirmed_at = timestamp
      order.payment_status = paymentMethodType === 'cod' ? 'unpaid' : 'paid'
    }
    if (step.status === 'seller_confirmed') {
      // no-op, giữ nguyên trạng thái thanh toán
    }
    if (step.status === 'shipping') {
      order.shipped_at = timestamp
      order.logistics_provider = 'Viettel Post'
    }
    if (step.status === 'delivered') {
      order.delivered_at = timestamp
      if (paymentMethodType === 'cod') {
        order.payment_status = 'paid'
      }
    }
    appendHistory(order, step.status, step.notes, timestamp)
  })
}

export const paymentService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    if (!isSupabaseConfigured) {
      return ensureLocalPaymentMethods()
    }
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return data || []
  },

  getSavedShippingAddress(userId: string) {
    if (!isSupabaseConfigured) {
      return getLocalShippingAddress(userId)
    }
    return null
  },

  async createOrder(orderData: CreateOrderData): Promise<string> {
    if (!isSupabaseConfigured) {
      const currentUser = localAuth.getCurrentUser()
      if (!currentUser) throw new Error('Chưa đăng nhập')

      const productSnapshot = findProductSnapshot(orderData.product_id) ?? {
        id: orderData.product_id,
        name: 'Sản phẩm không xác định',
        price: 0,
        image_url: 'https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg'
      }

      const paymentMethods = ensureLocalPaymentMethods()
      const paymentMethod = paymentMethods.find(method => method.id === orderData.payment_method_id) ?? paymentMethods[0]

      const orderId = `local-order-${Date.now()}`
      const createdAt = new Date().toISOString()
      const totalAmount = productSnapshot.price * orderData.quantity

      const order: LocalOrder = {
        id: orderId,
        user_id: currentUser.id,
        product_id: orderData.product_id,
        quantity: orderData.quantity,
        shipping_address: orderData.shipping_address,
        notes: orderData.notes,
        payment_method_id: paymentMethod?.id ?? orderData.payment_method_id,
        status: 'pending',
        payment_status: 'unpaid',
        total_amount: totalAmount,
        created_at: createdAt,
        product_snapshot: {
          id: productSnapshot.id,
          name: productSnapshot.name,
          price: productSnapshot.price,
          image_url: productSnapshot.image_url
        },
        payment_method_snapshot: paymentMethod ?? DEFAULT_PAYMENT_METHODS[0],
        order_status_history: []
      }

      appendHistory(order, 'pending', 'Đơn hàng được tạo từ người mua.', createdAt)

      const orders = readLocalOrders()
      orders.push(order)
      writeLocalOrders(orders)
      saveLocalShippingAddress(currentUser.id, orderData.shipping_address)

      return orderId
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Chưa đăng nhập')

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        product_id: orderData.product_id,
        quantity: orderData.quantity,
        shipping_address: orderData.shipping_address,
        notes: orderData.notes,
        payment_method_id: orderData.payment_method_id,
        status: 'pending',
        payment_status: 'unpaid'
      })
      .select('id')
      .single()

    if (error) throw error
    if (!data) throw new Error('Không thể tạo đơn hàng')

    // Add to order status history
    await supabase.from('order_status_history').insert({
      order_id: data.id,
      status: 'pending',
      notes: 'Đơn hàng được tạo',
      created_by: user.id
    })

    return data.id
  },

  async initiatePayment(orderId: string, paymentMethodType: string): Promise<PaymentResult> {
    if (!isSupabaseConfigured) {
      const orders = readLocalOrders()
      const order = orders.find(item => item.id === orderId)
      if (!order) {
        return { success: false, error: 'Không tìm thấy đơn hàng' }
      }

      simulateLocalOrderProgress(order, paymentMethodType)
      writeLocalOrders(orders)

      return { success: true, orderId }
    }

    const { data: order } = await supabase
      .from('orders')
      .select('*, products(*)')
      .eq('id', orderId)
      .single()

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' }
    }

    switch (paymentMethodType) {
      case 'vnpay':
        return this.createVNPayPayment(order)
      case 'momo':
        return this.createMomoPayment(order)
      case 'bank_transfer':
        return { success: true, orderId, paymentUrl: `/payment-instructions?orderId=${orderId}` }
      case 'cod':
        await this.updateOrderStatus(orderId, 'confirmed', 'unpaid')
        return { success: true, orderId }
      default:
        return { success: false, error: 'Phương thức thanh toán không hợp lệ' }
    }
  },

  createVNPayPayment(order: any): PaymentResult {
    const createDate = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
    const orderId = order.id.replace(/-/g, '').substring(0, 20)
    const amount = Math.round(order.total_amount * 100) // VNPay amount in VND * 100

    const vnpParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNPAY_TMN_CODE,
      vnp_Amount: amount.toString(),
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toan don hang ${order.products.name}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: VNPAY_RETURN_URL,
      vnp_TxnRef: orderId
    }

    // Sort params and create signature
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .map(key => `${key}=${vnpParams[key]}`)
      .join('&')

    const hmac = CryptoJS.HmacSHA512(sortedParams, VNPAY_HASH_SECRET)
    const secureHash = hmac.toString(CryptoJS.enc.Hex)

    const paymentUrl = `${VNPAY_URL}?${sortedParams}&vnp_SecureHash=${secureHash}`

    return { success: true, paymentUrl, orderId: order.id }
  },

  async createMomoPayment(order: any): Promise<PaymentResult> {
    const orderId = order.id.replace(/-/g, '').substring(0, 20)
    const amount = Math.round(order.total_amount)
    const requestId = orderId + new Date().getTime()

    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${MOMO_NOTIFY_URL}&orderId=${orderId}&orderInfo=Thanh toan don hang&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_RETURN_URL}&requestId=${requestId}&requestType=captureWallet`

    const signature = CryptoJS.HmacSHA256(rawSignature, MOMO_SECRET_KEY).toString(CryptoJS.enc.Hex)

    const requestBody = {
      partnerCode: MOMO_PARTNER_CODE,
      accessKey: MOMO_ACCESS_KEY,
      requestId,
      amount,
      orderId,
      orderInfo: `Thanh toán đơn hàng ${order.products.name}`,
      redirectUrl: MOMO_RETURN_URL,
      ipnUrl: MOMO_NOTIFY_URL,
      extraData: '',
      requestType: 'captureWallet',
      signature,
      lang: 'vi'
    }

    try {
      const response = await fetch(MOMO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.resultCode === 0) {
        return { success: true, paymentUrl: data.payUrl, orderId: order.id }
      } else {
        return { success: false, error: data.message || 'Lỗi kết nối Momo' }
      }
    } catch (error) {
      return { success: false, error: 'Không thể kết nối đến Momo' }
    }
  },

  async verifyVNPayReturn(params: Record<string, string>): Promise<boolean> {
    const secureHash = params.vnp_SecureHash
    delete params.vnp_SecureHash
    delete params.vnp_SecureHashType

    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')

    const hmac = CryptoJS.HmacSHA512(sortedParams, VNPAY_HASH_SECRET)
    const calculatedHash = hmac.toString(CryptoJS.enc.Hex)

    if (secureHash === calculatedHash && params.vnp_ResponseCode === '00') {
      const orderId = params.vnp_TxnRef
      await this.recordPaymentSuccess(orderId, 'vnpay', params)
      return true
    }

    return false
  },

  async recordPaymentSuccess(orderId: string, _method: string, transactionData: any) {
    if (!isSupabaseConfigured) {
      const orders = readLocalOrders()
      const order = orders.find(item => item.id === orderId)
      if (order) {
        if (order.order_status_history.length <= 1) {
          simulateLocalOrderProgress(order, 'vnpay')
        }
        order.payment_status = 'paid'
        writeLocalOrders(orders)
      }
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Update order payment status
    await supabase
      .from('orders')
      .update({ 
        payment_status: 'paid',
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', orderId)

    // Record payment transaction
    await supabase.from('payment_transactions').insert({
      order_id: orderId,
      amount: transactionData.vnp_Amount ? transactionData.vnp_Amount / 100 : transactionData.amount,
      status: 'success',
      transaction_id: transactionData.vnp_TransactionNo || transactionData.transId,
      response_data: transactionData,
      completed_at: new Date().toISOString()
    })

    // Add status history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      status: 'confirmed',
      notes: 'Thanh toán thành công',
      created_by: user?.id
    })
  },

  async updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
    if (!isSupabaseConfigured) {
      const orders = readLocalOrders()
      const order = orders.find(item => item.id === orderId)
      if (!order) return

      const timestamp = new Date().toISOString()
      order.status = status
      if (paymentStatus) {
        order.payment_status = paymentStatus as 'unpaid' | 'paid'
      }
      if (status === 'confirmed' || status === 'buyer_confirmed') {
        order.confirmed_at = timestamp
      }
      if (status === 'shipping') {
        order.shipped_at = timestamp
        order.logistics_provider = order.logistics_provider || 'Viettel Post'
      }
      if (status === 'delivered') {
        order.delivered_at = timestamp
      }

      appendHistory(order, status, 'Cập nhật trạng thái thủ công.', timestamp)
      writeLocalOrders(orders)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    const updateData: any = { status }
    if (paymentStatus) updateData.payment_status = paymentStatus
    if (status === 'confirmed') updateData.confirmed_at = new Date().toISOString()
    if (status === 'shipping') updateData.shipped_at = new Date().toISOString()
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString()

    await supabase.from('orders').update(updateData).eq('id', orderId)

    await supabase.from('order_status_history').insert({
      order_id: orderId,
      status,
      created_by: user?.id
    })
  },

  async getOrderDetails(orderId: string) {
    if (!isSupabaseConfigured) {
      const order = readLocalOrders().find(item => item.id === orderId)
      if (!order) throw new Error('Không tìm thấy đơn hàng')

      const { product_snapshot, payment_method_snapshot, ...rest } = order
      return {
        ...rest,
        products: product_snapshot,
        payment_methods: payment_method_snapshot,
        order_status_history: order.order_status_history
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products(*),
        payment_methods:payment_method_id(*),
        payment_transactions(*),
        order_status_history(*)
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  },

  async getUserOrders() {
    if (!isSupabaseConfigured) {
      const currentUser = localAuth.getCurrentUser()
      if (!currentUser) return []

      const orders = readLocalOrders().filter(order => order.user_id === currentUser.id)
      return orders.map(order => {
        const { product_snapshot, payment_method_snapshot, ...rest } = order
        return {
          ...rest,
          products: product_snapshot,
          payment_methods: payment_method_snapshot
        }
      })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('orders')
      .select('*, products(*), payment_methods:payment_method_id(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}
