'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../context/AuthContext'
import { useLocale } from '../../../context/LocaleContext'
import PasswordField from '../../../components/PasswordField'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const { locale, pick } = useLocale()
  const router = useRouter()

  const [zones, setZones] = useState([])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [address, setAddress] = useState('')
  const [shippingZoneId, setShippingZoneId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('shipping_zones').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setZones(data || []))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signUp({ email, password, fullName, phone, governorate, address, shippingZoneId })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push('/')
  }

  return (
    <div className="checkout-page" style={{ maxWidth: 480 }}>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <h2>{locale === 'ar' ? 'إنشاء حساب' : 'Create account'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</p>}
        <div className="form-field">
          <label>{locale === 'ar' ? 'الاسم بالكامل' : 'Full name'}</label>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'الإيميل' : 'Email'}</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'رقم الموبايل' : 'Phone number'}</label>
          <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'كلمة السر' : 'Password'}</label>
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'المحافظة' : 'Governorate'}</label>
          <input required value={governorate} onChange={(e) => setGovernorate(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'العنوان' : 'Address'}</label>
          <textarea required rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'منطقة الشحن' : 'Shipping zone'}</label>
          <select required value={shippingZoneId} onChange={(e) => setShippingZoneId(e.target.value)}>
            <option value="">{locale === 'ar' ? 'اختاري منطقتك' : 'Select your zone'}</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{pick(z, 'name')}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? '...' : locale === 'ar' ? 'إنشاء الحساب' : 'Create account'}
        </button>
        <p style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: 'var(--ink-soft)' }}>
          {locale === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link href="/account/login" style={{ color: 'var(--brand)', fontWeight: 700 }}>
            {locale === 'ar' ? 'دخول' : 'Log in'}
          </Link>
        </p>
      </form>
    </div>
  )
}
