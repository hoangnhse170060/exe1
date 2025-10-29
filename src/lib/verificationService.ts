import { supabase } from './supabase'

export interface VerificationCodeRequest {
  email?: string
  phone?: string
}

export interface VerifyCodeRequest {
  email?: string
  phone?: string
  code: string
}

export const verificationService = {
  // Generate and send email verification code
  async sendEmailVerification(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check rate limiting - max 3 requests per 10 minutes
      const { data: recentCodes } = await supabase
        .from('email_verifications')
        .select('id')
        .eq('email', email)
        .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      
      if (recentCodes && recentCodes.length >= 3) {
        return { success: false, error: 'Vui lòng đợi 10 phút trước khi gửi lại mã' }
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes

      // Save to database
      const { error } = await supabase
        .from('email_verifications')
        .insert({
          email,
          code,
          expires_at: expiresAt,
          verified: false,
          attempts: 0
        })

      if (error) throw error

      // In production, send email via Supabase Edge Function or external service
      // For now, just log (development mode)
      console.log(`📧 Email verification code for ${email}: ${code}`)
      
      // TODO: Send actual email
      // await sendEmail({
      //   to: email,
      //   subject: 'Mã xác thực đăng ký - Echoes of Việt Nam',
      //   body: `Mã xác thực của bạn là: ${code}\nMã có hiệu lực trong 5 phút.`
      // })

      return { success: true }
    } catch (error: any) {
      console.error('Send email verification error:', error)
      return { success: false, error: error.message || 'Không thể gửi mã xác thực' }
    }
  },

  // Verify email code
  async verifyEmail(email: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get latest verification code
      const { data, error } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('email', email)
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return { success: false, error: 'Không tìm thấy mã xác thực' }
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        return { success: false, error: 'Mã xác thực đã hết hạn' }
      }

      // Check attempts
      if (data.attempts >= 5) {
        return { success: false, error: 'Đã vượt quá số lần thử. Vui lòng yêu cầu mã mới' }
      }

      // Check code match
      if (data.code !== code) {
        // Increment attempts
        await supabase
          .from('email_verifications')
          .update({ attempts: data.attempts + 1 })
          .eq('id', data.id)
        
        return { success: false, error: 'Mã xác thực không đúng' }
      }

      // Mark as verified
      await supabase
        .from('email_verifications')
        .update({ verified: true })
        .eq('id', data.id)

      return { success: true }
    } catch (error: any) {
      console.error('Verify email error:', error)
      return { success: false, error: error.message || 'Không thể xác thực' }
    }
  },

  // Generate and send phone verification code
  async sendPhoneVerification(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate phone format (Vietnam: 10 digits starting with 0)
      if (!/^0\d{9}$/.test(phone)) {
        return { success: false, error: 'Số điện thoại không hợp lệ' }
      }

      // Check rate limiting
      const { data: recentCodes } = await supabase
        .from('phone_verifications')
        .select('id')
        .eq('phone', phone)
        .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      
      if (recentCodes && recentCodes.length >= 3) {
        return { success: false, error: 'Vui lòng đợi 10 phút trước khi gửi lại mã' }
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

      // Save to database
      const { error } = await supabase
        .from('phone_verifications')
        .insert({
          phone,
          code,
          expires_at: expiresAt,
          verified: false,
          attempts: 0
        })

      if (error) throw error

      // In production, send SMS via Twilio, Viettel, or other SMS provider
      console.log(`📱 Phone verification code for ${phone}: ${code}`)
      
      // TODO: Send actual SMS
      // await sendSMS({
      //   to: phone,
      //   message: `Ma xac thuc Echoes of Viet Nam: ${code}. Co hieu luc trong 5 phut.`
      // })

      return { success: true }
    } catch (error: any) {
      console.error('Send phone verification error:', error)
      return { success: false, error: error.message || 'Không thể gửi mã xác thực' }
    }
  },

  // Verify phone code
  async verifyPhone(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return { success: false, error: 'Không tìm thấy mã xác thực' }
      }

      if (new Date(data.expires_at) < new Date()) {
        return { success: false, error: 'Mã xác thực đã hết hạn' }
      }

      if (data.attempts >= 5) {
        return { success: false, error: 'Đã vượt quá số lần thử. Vui lòng yêu cầu mã mới' }
      }

      if (data.code !== code) {
        await supabase
          .from('phone_verifications')
          .update({ attempts: data.attempts + 1 })
          .eq('id', data.id)
        
        return { success: false, error: 'Mã xác thực không đúng' }
      }

      await supabase
        .from('phone_verifications')
        .update({ verified: true })
        .eq('id', data.id)

      return { success: true }
    } catch (error: any) {
      console.error('Verify phone error:', error)
      return { success: false, error: error.message || 'Không thể xác thực' }
    }
  },

  // Check if email is verified
  async isEmailVerified(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('email_verifications')
      .select('id')
      .eq('email', email)
      .eq('verified', true)
      .limit(1)
      .single()
    
    return !!data
  },

  // Check if phone is verified
  async isPhoneVerified(phone: string): Promise<boolean> {
    const { data } = await supabase
      .from('phone_verifications')
      .select('id')
      .eq('phone', phone)
      .eq('verified', true)
      .limit(1)
      .single()
    
    return !!data
  }
}
