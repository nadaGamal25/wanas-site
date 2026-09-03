'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { useLocale } from '../../context/LocaleContext'
import ProductCard from '../../components/ProductCard'

export default function ProductsContent() {
  const { t, pick } = useLocale()
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category')

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      setCategories(cats || [])

      let query = supabase
        .from('products')
        .select('*, categories(slug)')
        .eq('is_active', true)

      if (categorySlug) {
        const match = (cats || []).find(
          (c) => c.slug === categorySlug
        )

        setActiveCategory(match || null)

        if (match) {
          query = query.eq('category_id', match.id)
        }
      } else {
        setActiveCategory(null)
      }

      const { data: prods } = await query.order('created_at', {
        ascending: false
      })

      setProducts(prods || [])
      setLoading(false)
    }

    load()
  }, [categorySlug])

  return (
    <div className="section">
      <div className="section-head">
        <h2>
          {activeCategory
            ? pick(activeCategory, 'name')
            : t.products.title}
        </h2>
      </div>

      <div
        className="wrap"
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 36
        }}
      >
        <a
          href="/products"
          className="btn-outline"
          style={{ padding: '8px 18px', fontSize: 13 }}
        >
          {t.products.all}
        </a>

        {categories.map((c) => (
          <a
            key={c.id}
            href={`/products?category=${c.slug}`}
            className="btn-outline"
            style={{ padding: '8px 18px', fontSize: 13 }}
          >
            {pick(c, 'name')}
          </a>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">{t.products.empty}</div>
      ) : (
        <div className="prod-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}