'use client'

import Link from 'next/link'
import { useLocale } from '../context/LocaleContext'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { t, pick } = useLocale()
  const { addItem } = useCart()

  return (
    <div className="prod-card">
      <Link href={`/products/${product.slug}`}>
        <div className="prod-img">
          {product.discount_price && <span className="badge-sale">%</span>}
          {product.image_url && <img src={product.image_url} alt={pick(product, 'name')} />}
        </div>
      </Link>
      <div className="prod-info">
        <Link href={`/products/${product.slug}`}>
          <h4>{pick(product, 'name')}</h4>
        </Link>
        <div className="prod-price">
          {product.discount_price ? (
            <>
              <span className="old">{product.price} ج.م</span>
              {product.discount_price} ج.م
            </>
          ) : (
            <>{product.price} ج.م</>
          )}
        </div>
        <button className="btn-add" onClick={() => addItem(product)}>{t.products.addToCart}</button>
      </div>
    </div>
  )
}
