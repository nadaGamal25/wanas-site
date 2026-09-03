'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { useLocale } from '../../../context/LocaleContext'
import PasswordField from '../../../components/PasswordField'

export default function ResetPasswordPage() {
  const { locale } = useLocale()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    // Supabase بيحط جلسة مؤقتة تلقائي لما العميل يدوس على لينك الإيميل
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/account/orders'), 1500)
  }

  return (
    <div className="checkout-page" style={{ maxWidth: 420 }}>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <h2>{locale === 'ar' ? 'كلمة سر جديدة' : 'New password'}</h2>
      </div>

      {done ? (
        <div className="payment-note">
          {locale === 'ar' ? 'اتغيرت كلمة السر بنجاح، جاري تحويلك...' : 'Password updated, redirecting...'}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</p>}
          <div className="form-field">
            <label>{locale === 'ar' ? 'كلمة السر الجديدة' : 'New password'}</label>
            <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '...' : locale === 'ar' ? 'حفظ كلمة السر' : 'Save password'}
          </button>
        </form>
      )}
    </div>
  )
}
