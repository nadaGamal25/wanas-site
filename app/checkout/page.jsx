'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import { useLocale } from '../../context/LocaleContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const VODAFONE_NUMBER = process.env.NEXT_PUBLIC_VODAFONE_CASH_NUMBER || '01000000000'
const INSTAPAY_HANDLE = process.env.NEXT_PUBLIC_INSTAPAY_HANDLE || 'wanas@instapay'

export default function CheckoutPage() {
  const { t, locale, pick } = useLocale()
  const { items, subtotal, clearCart } = useCart()
  const { session, profile } = useAuth()

  const [zones, setZones] = useState([])
  const [useSaved, setUseSaved] = useState(true)
  const [zoneId, setZoneId] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)

  useEffect(() => {
    supabase.from('shipping_zones').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setZones(data || []))
  }, [])

  // لما يبقى فيه بروفايل محفوظ، نملى البيانات منه لحد ما تختار "بيانات مختلفة"
  function chooseSaved() {
    setUseSaved(true)
    setName(profile?.full_name || '')
    setPhone(profile?.phone || '')
    setGovernorate(profile?.governorate || '')
    setAddress(profile?.address || '')
    setZoneId(profile?.shipping_zone_id || '')
  }

  function chooseDifferent() {
    setUseSaved(false)
    setName('')
    setPhone('')
    setGovernorate('')
    setAddress('')
    setZoneId('')
  }

  useEffect(() => {
    if (profile) chooseSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const hasSavedProfile = !!profile

  const selectedZone = zones.find((z) => z.id === zoneId)
  const shippingCost = selectedZone ? Number(selectedZone.price) : 0
  const total = subtotal + shippingCost

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      alert(locale === 'ar' ? 'من فضلك اكتبي الاسم' : 'Please enter your name')
      return
    }
    if (!phone.trim() || phone.trim().length < 8) {
      alert(locale === 'ar' ? 'من فضلك اكتبي رقم موبايل صحيح' : 'Please enter a valid phone number')
      return
    }
    if (!governorate.trim() || !address.trim()) {
      alert(locale === 'ar' ? 'من فضلك اكتبي المحافظة والعنوان' : 'Please enter your governorate and address')
      return
    }
    if (!zoneId) {
      alert(locale === 'ar' ? 'من فضلك اختاري منطقة الشحن' : 'Please select a shipping zone')
      return
    }
    setSubmitting(true)

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: session?.user?.id || null,
        customer_name: name,
        phone,
        governorate,
        address,
        shipping_zone_id: zoneId,
        payment_method: paymentMethod,
        subtotal,
        shipping_cost: shippingCost,
        total,
      })
      .select()
      .single()

    if (error || !order) {
      setSubmitting(false)
      alert('حصل خطأ في إرسال الطلب، حاولي تاني')
      return
    }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      product_name_ar: i.name_ar,
      product_name_en: i.name_en,
      unit_price: i.price,
      quantity: i.qty,
    }))
    await supabase.from('order_items').insert(orderItems)

    setOrderNumber(order.order_number)
    clearCart()
    setSubmitting(false)
  }

  if (orderNumber) {
    return (
      <div className="order-success">
        <h1>{t.checkout.successTitle}</h1>
        <p style={{ marginBottom: 8 }}>{t.checkout.successText}: <strong>#{orderNumber}</strong></p>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>{t.checkout.successNote}</p>
        <Link href="/" className="btn-primary">{t.checkout.backHome}</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>{t.cart.empty}</p>
          <Link href="/products" className="btn-primary">{t.cart.continueShopping}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="section-head" style={{ marginBottom: 24 }}>
        <h2>{t.checkout.title}</h2>
      </div>

      {!session && (
        <div className="payment-note" style={{ marginBottom: 20 }}>
          {locale === 'ar'
            ? <>لديك حساب؟ <Link href="/account/login" style={{ fontWeight: 700 }}>سجّل دخولك</Link> عشان بياناتك تتحفظ للمرة الجاية، أو كمّل من غير حساب.</>
            : <>Have an account? <Link href="/account/login" style={{ fontWeight: 700 }}>Log in</Link> to save your details for next time, or continue as a guest.</>}
        </div>
      )}

      {hasSavedProfile && (
        <div className="payment-options" style={{ marginBottom: 20 }}>
          <div className={`payment-option ${useSaved ? 'selected' : ''}`} onClick={chooseSaved}>
            <input type="radio" checked={useSaved} readOnly /> {locale === 'ar' ? 'استخدام بياناتي المحفوظة' : 'Use my saved details'}
          </div>
          <div className={`payment-option ${!useSaved ? 'selected' : ''}`} onClick={chooseDifferent}>
            <input type="radio" checked={!useSaved} readOnly /> {locale === 'ar' ? 'إدخال بيانات مختلفة' : 'Use different details'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>{t.checkout.name}</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t.checkout.phone}</label>
          <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{locale === 'ar' ? 'المحافظة' : 'Governorate'}</label>
          <input required value={governorate} onChange={(e) => setGovernorate(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t.checkout.address}</label>
          <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t.checkout.shippingZone}</label>
          <select required value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
            <option value="">{t.checkout.selectZone}</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{pick(z, 'name')} — {z.price} ج.م</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>{t.checkout.paymentMethod}</label>
          <div className="payment-options">
            <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
              <input type="radio" checked={paymentMethod === 'cod'} readOnly style={{ flex: 1 }}/> <span>{t.checkout.cod}</span>
            </div>
            <div className={`payment-option ${paymentMethod === 'vodafone_cash' ? 'selected' : ''}`} onClick={() => setPaymentMethod('vodafone_cash')}>
              <input type="radio" checked={paymentMethod === 'vodafone_cash'} readOnly  style={{ flex: 1 }}/> {t.checkout.vodafoneCash}
            </div>
            <div className={`payment-option ${paymentMethod === 'instapay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('instapay')}>
              <input type="radio" checked={paymentMethod === 'instapay'} readOnly style={{ flex: 1 }}/> <span>{t.checkout.instapay}</span>
            </div>
          </div>
        </div>

        {paymentMethod === 'vodafone_cash' && (
          <div className="payment-note">
            {t.checkout.vodafoneNote} <strong>{VODAFONE_NUMBER}</strong><br />{t.checkout.confirmNote}
          </div>
        )}
        {paymentMethod === 'instapay' && (
          <div className="payment-note">
            {t.checkout.instapayNote} <strong>{INSTAPAY_HANDLE}</strong><br />{t.checkout.confirmNote}
          </div>
        )}

        <div className="cart-summary">
          <div className="row"><span>{t.checkout.subtotal}</span><span>{subtotal} ج.م</span></div>
          <div className="row"><span>{t.checkout.shipping}</span><span>{shippingCost} ج.م</span></div>
          <div className="row total"><span>{t.checkout.total}</span><span>{total} ج.م</span></div>
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: 20 }} disabled={submitting}>
          {submitting ? t.checkout.placing : t.checkout.placeOrder}
        </button>
      </form>
    </div>
  )
}
