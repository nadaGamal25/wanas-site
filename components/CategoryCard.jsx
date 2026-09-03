'use client'

import Link from 'next/link'
import { useLocale } from '../context/LocaleContext'

export default function CategoryCard({ category }) {
  const { pick } = useLocale()

  return (
    <Link href={`/products?category=${category.slug}`} className="cat-card">
      <div className="cat-frame">
        {category.image_url ? (
          <img src={category.image_url} alt={pick(category, 'name')} />
        ) : (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--brand)' }}>
            {pick(category, 'name')?.[0]}
          </span>
        )}
      </div>
      <h3>{pick(category, 'name')}</h3>
    </Link>
  )
}
