'use client'

import Link from 'next/link'
import { useLocale } from '../../context/LocaleContext'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
  const { t, locale, pick } = useLocale()
  const { items, removeItem, updateQty, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>{t.cart.empty}</p>
          <Link href="/products" className="btn-primary">{t.cart.continueShopping}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="section-head" style={{ marginBottom: 20 }}>
        <h2>{t.cart.title}</h2>
      </div>

      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          {item.image_url && <img src={item.image_url} alt="" />}
          <div className="info">
            <div style={{ fontWeight: 700 }}>{locale === 'ar' ? item.name_ar : item.name_en}</div>
            <div style={{ color: 'var(--brand)', fontWeight: 700 }}>{item.price} ج.م</div>
          </div>
          <div className="qty-controls">
            <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          </div>
          <button className="btn-link" onClick={() => removeItem(item.id)} style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer' }}>
            {t.cart.remove}
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <div className="row total">
          <span>{t.cart.subtotal}</span>
          <span>{subtotal} ج.م</span>
        </div>
      </div>

      <Link href="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>
        {t.cart.checkout}
      </Link>
    </div>
  )
}
