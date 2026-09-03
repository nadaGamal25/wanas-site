'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../context/AuthContext'
import { useLocale } from '../../../context/LocaleContext'

export default function MyOrdersPage() {
  const { session, loading: authLoading, signOut } = useAuth()
  const { locale } = useLocale()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!session) {
      setLoading(false)
      return
    }
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('customer_id', session.user.id)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [session, authLoading])

  if (authLoading || loading) return <div className="empty-state">...</div>

  if (!session) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>{locale === 'ar' ? 'سجّل دخولك لتشوفي طلباتك' : 'Log in to see your orders'}</p>
          <Link href="/account/login" className="btn-primary">{locale === 'ar' ? 'تسجيل الدخول' : 'Log in'}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="section-head" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'start' }}>
        <h2>{locale === 'ar' ? 'طلباتي' : 'My Orders'}</h2>
       {/* <button className="btn-secondary" onClick={signOut}>{locale === 'ar' ? 'تسجيل الخروج' : 'Log out'}</button>*/}
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>{locale === 'ar' ? 'لسه مفيش أي طلب' : "You haven't placed any orders yet"}</p>
          <Link href="/products" className="btn-primary">{locale === 'ar' ? 'تصفح المنتجات' : 'Browse products'}</Link>
        </div>
      ) : (
        orders.map((o) => (
          <div className="card card-order" key={o.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <strong>#{o.order_number}</strong>
              <span className="badge badge-status">{o.status}</span>
            </div>
            {o.order_items.map((item) => (
              <div key={item.id} style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 4 }}>
                {locale === 'ar' ? item.product_name_ar : item.product_name_en} × {item.quantity}
              </div>
            ))}
            <div style={{ marginTop: 10, fontWeight: 700 }}>{locale === 'ar' ? 'الإجمالي' : 'Total'}: {o.total} ج.م</div>
          </div>
        ))
      )}
    </div>
  )
}
