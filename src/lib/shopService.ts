import { supabase } from './supabase'

export interface ShopRequest {
  shopName: string
  description: string
  logoUrl?: string
  address: string
  packageType: 'BASIC' | 'PRO'
  paymentProofUrl?: string
}

export interface Shop {
  id: string
  ownerId: string
  name: string
  description: string
  logoUrl: string
  address: string
  packageType: 'BASIC' | 'PRO'
  revenue: number
  revenueLimit: number
  firstShippingSupportPercent: number
  secondShippingSupportPercent: number
  isActive: boolean
  depositAmount: number
  createdAt: string
}

export const shopService = {
  // Get package details
  getPackageDetails(packageType: 'BASIC' | 'PRO') {
    if (packageType === 'BASIC') {
      return {
        name: 'Gói Cơ Bản',
        price: 300000,
        revenueLimit: 10000000,
        firstShippingSupport: 30,
        secondShippingSupport: 0,
        benefits: [
          'Gửi tiền đặt cọc có thể hoàn trả',
          'Đăng và quảng cáo sản phẩm',
          'Hỗ trợ vận chuyển 30% cho đơn hàng đầu tiên',
          'Doanh thu tối đa: 10,000,000 VNĐ',
          'Dashboard quản lý cơ bản'
        ]
      }
    } else {
      return {
        name: 'Gói Pro',
        price: 500000,
        revenueLimit: 30000000,
        firstShippingSupport: 30,
        secondShippingSupport: 15,
        benefits: [
          'Tất cả quyền lợi gói Cơ Bản',
          'Hỗ trợ vận chuyển 30% đơn đầu tiên',
          'Hỗ trợ vận chuyển 15% các đơn tiếp theo',
          'Doanh thu tối đa: 30,000,000 VNĐ',
          'Dashboard nâng cao với analytics',
          'Ưu tiên hiển thị sản phẩm'
        ]
      }
    }
  },

  // Check if user is eligible for shop (≥200 stars)
  async isEligibleForShop(): Promise<{ eligible: boolean; stars: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { eligible: false, stars: 0 }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('stars')
        .eq('user_id', user.id)
        .single()

      const stars = profile?.stars || 0
      return { eligible: stars >= 200, stars }
    } catch (error) {
      console.error('Check eligibility error:', error)
      return { eligible: false, stars: 0 }
    }
  },

  // Submit shop request
  async submitShopRequest(request: ShopRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { success: false, error: 'Chưa đăng nhập' }

      // Check eligibility
      const { eligible, stars } = await this.isEligibleForShop()
      if (!eligible) {
        return { success: false, error: `Bạn cần đạt 200 sao để đăng ký (hiện tại: ${stars} sao)` }
      }

      // Check if already has pending/approved request
      const { data: existingRequest } = await supabase
        .from('shop_requests')
        .select('id, status')
        .eq('user_id', user.id)
        .in('status', ['pending', 'approved'])
        .single()

      if (existingRequest) {
        return { 
          success: false, 
          error: existingRequest.status === 'approved' 
            ? 'Bạn đã có shop' 
            : 'Bạn đã có đơn đăng ký đang chờ duyệt'
        }
      }

      const packageDetails = this.getPackageDetails(request.packageType)

      // Create request
      const { error } = await supabase
        .from('shop_requests')
        .insert({
          user_id: user.id,
          shop_name: request.shopName,
          description: request.description,
          logo_url: request.logoUrl,
          address: request.address,
          package_type: request.packageType,
          payment_amount: packageDetails.price,
          payment_proof_url: request.paymentProofUrl,
          payment_status: 'pending',
          status: 'pending'
        })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      console.error('Submit shop request error:', error)
      return { success: false, error: error.message || 'Không thể gửi đơn đăng ký' }
    }
  },

  // Get user's shop request status
  async getShopRequestStatus(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from('shop_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return data
    } catch (error) {
      return null
    }
  },

  // Get user's shop (if they have one)
  async getUserShop(): Promise<Shop | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (!data) return null

      return {
        id: data.id,
        ownerId: data.owner_id,
        name: data.name,
        description: data.description,
        logoUrl: data.logo_url,
        address: data.address,
        packageType: data.package_type,
        revenue: data.revenue,
        revenueLimit: data.revenue_limit,
        firstShippingSupportPercent: data.first_shipping_support_percent,
        secondShippingSupportPercent: data.second_shipping_support_percent,
        isActive: data.is_active,
        depositAmount: data.deposit_amount,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Get user shop error:', error)
      return null
    }
  },

  // Get shop products
  async getShopProducts(shopId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get shop orders
  async getShopOrders(shopId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(*), user_profiles!orders_user_id_fkey(*)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get shop revenue transactions
  async getShopRevenueTransactions(shopId: string) {
    const { data, error } = await supabase
      .from('shop_revenue_transactions')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get shop statistics
  async getShopStatistics(shopId: string) {
    try {
      const [shop, orders, products] = await Promise.all([
        supabase.from('shops').select('*').eq('id', shopId).single(),
        supabase.from('orders').select('id, total_amount, payment_status').eq('shop_id', shopId),
        supabase.from('products').select('id').eq('shop_id', shopId)
      ])

      const totalOrders = orders.data?.length || 0
      const paidOrders = orders.data?.filter(o => o.payment_status === 'paid') || []
      const totalRevenue = shop.data?.revenue || 0
      const productCount = products.data?.length || 0

      return {
        totalOrders,
        paidOrders: paidOrders.length,
        totalRevenue,
        productCount,
        revenueLimit: shop.data?.revenue_limit || 0,
        revenuePercentage: shop.data?.revenue_limit 
          ? (totalRevenue / shop.data.revenue_limit) * 100 
          : 0
      }
    } catch (error) {
      console.error('Get shop statistics error:', error)
      return null
    }
  }
}
