'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'
import { useLocale } from '../../../context/LocaleContext'

export default function ForgotPasswordPage() {
  const { locale } = useLocale()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const redirectTo = `${window.location.origin}/account/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="checkout-page" style={{ maxWidth: 420 }}>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <h2>{locale === 'ar' ? 'نسيت كلمة السر' : 'Forgot password'}</h2>
      </div>

      {sent ? (
        <div className="payment-note">
          {locale === 'ar'
            ? 'لو الإيميل ده مسجل عندنا، هيوصلك لينك لتغيير كلمة السر خلال دقايق.'
            : "If this email is registered, you'll receive a reset link shortly."}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</p>}
          <div className="form-field">
            <label>{locale === 'ar' ? 'الإيميل' : 'Email'}</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '...' : locale === 'ar' ? 'ابعتيلي لينك التغيير' : 'Send reset link'}
          </button>
        </form>
      )}

      <p style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: 'var(--ink-soft)' }}>
        <Link href="/account/login" style={{ color: 'var(--brand)', fontWeight: 700 }}>
          {locale === 'ar' ? 'رجوع لتسجيل الدخول' : 'Back to login'}
        </Link>
      </p>
    </div>
  )
}
