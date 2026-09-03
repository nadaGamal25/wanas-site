'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useLocale } from '../context/LocaleContext'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201000000000'

export default function HomePage() {
  const { t } = useLocale()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('products').select('*').eq('is_active', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(8),
      ])
      setCategories(cats || [])
      setProducts(prods || [])
    }
    load()
  }, [])

  return (
    <>
      <section className="hero">
        <span className="hero-eyebrow">{t.hero.eyebrow}</span>
        <h1>{t.hero.title1} <span>{t.hero.title2}</span></h1>
        <p>{t.hero.subtitle}</p>
        <Link href="/products" className="btn-primary">{t.hero.cta}</Link>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('عايز أطلب تصميم Custom')}`} target="_blank" rel="noreferrer" className="btn-outline">{t.hero.ctaCustom}</a>
      </section>

      {categories.length > 0 && (
        <section className="section">
          <div className="section-head">
            <span className="eyebrow">{t.categories.eyebrow}</span>
            <h2>{t.categories.title}</h2>
            <p>{t.categories.subtitle}</p>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-head">
          <span className="eyebrow">{t.why.eyebrow}</span>
          <h2>{t.why.title}</h2>
        </div>
        <div className="why-grid">
          {t.why.items.map((item, i) => (
            <div className="why-card" key={i}>
              <div className="why-num">0{i + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="section">
          <div className="section-head">
            <span className="eyebrow">Bestsellers</span>
            <h2>{t.products.bestsellers}</h2>
          </div>
          <div className="prod-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
