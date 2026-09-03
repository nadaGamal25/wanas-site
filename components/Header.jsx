'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from '../context/LocaleContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiShoppingCart, FiUserCircle } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
export default function Header() {
  const { locale, toggleLocale, t } = useLocale()
  const { count } = useCart()
  const { session, signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  async function handleLogout() {
    await signOut()
    setOpen(false)
    router.push('/')
  }

  return (
    <header className="site-header">
      <div className="nav">
        <Link href="/" className="logo">وَنَس</Link>
        <div className="nav-links">
          <Link href="/">{t.nav.home}</Link>
          <Link href="/products">{t.nav.products}</Link>
        </div>
        <div className="nav-right">
          <button className="lang-toggle" onClick={toggleLocale}>
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>

          {session ? (
            <div ref={ref} style={{ position: 'relative' }}>
              <button className="cart-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setOpen((o) => !o)}>
                <FaRegUserCircle style={{ color: "#3D2F22" }} />
              </button>
              {open && (
                <div
                  style={{
                    position: 'absolute', top: '130%', insetInlineEnd: 0, background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 10, minWidth: 150, boxShadow: '0 10px 24px rgba(0,0,0,0.08)', zIndex: 10, overflow: 'hidden',
                  }}
                >
                  <Link
                    href="/account/orders"
                    onClick={() => setOpen(false)}
                    style={{ display: 'block', padding: '10px 16px', fontSize: 14 }}
                  >
                    {locale === 'ar' ? 'طلباتي' : 'My Orders'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ display: 'block', width: '100%', textAlign: 'start', padding: '10px 16px', fontSize: 14, background: 'none', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer', color: 'var(--danger)' }}
                  >
                    {locale === 'ar' ? 'تسجيل الخروج' : 'Log out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/account/login" className="cart-link" title={locale === 'ar' ? 'حسابي' : 'My account'}>
               <FaRegUserCircle style={{ color: "#3D2F22" }} />
            </Link>
          )}

          <Link href="/cart" className="cart-link">
            <FiShoppingCart style={{ color: "#3D2F22" }}/>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
