'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { useLocale } from '../../../context/LocaleContext'
import PasswordField from '../../../components/PasswordField'

export default function LoginPage() {
  const { signIn } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      setError(locale === 'ar' ? 'الإيميل أو كلمة السر غلط' : 'Incorrect email or password')
      return
    }
    router.push('/')
  }

  return (
    <div className="checkout-page" style={{ maxWidth: 420 }}>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <h2>{locale === 'ar' ? 'تسجيل الدخول' : 'Log in'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</p>}
        <div className="form-field">
          <label>{locale === 'ar' ? 'الإيميل' : 'Email'}</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'كلمة السر' : 'Password'}</label>
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? '...' : locale === 'ar' ? 'دخول' : 'Log in'}
        </button>
        <p style={{ marginTop: 12, fontSize: 13, textAlign: 'center' }}>
          <Link href="/account/forgot-password" style={{ color: 'var(--ink-soft)' }}>
            {locale === 'ar' ? 'نسيت كلمة السر؟' : 'Forgot password?'}
          </Link>
        </p>
        <p style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: 'var(--ink-soft)' }}>
          {locale === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <Link href="/account/register" style={{ color: 'var(--brand)', fontWeight: 700 }}>
            {locale === 'ar' ? 'إنشاء حساب' : 'Sign up'}
          </Link>
        </p>
      </form>
    </div>
  )
}
