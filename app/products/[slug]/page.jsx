'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { useLocale } from '../../../context/LocaleContext'
import { useCart } from '../../../context/CartContext'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { t, pick } = useLocale()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [gallery, setGallery] = useState([])
  const [activeImg, setActiveImg] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: prod } = await supabase.from('products').select('*').eq('slug', slug).single()
      if (!prod) return
      setProduct(prod)
      setActiveImg(prod.image_url)
      const { data: imgs } = await supabase.from('product_images').select('*').eq('product_id', prod.id).order('sort_order')
      setGallery(imgs || [])
    }
    load()
  }, [slug])

  if (!product) return <div className="empty-state">...</div>

  const allImages = [product.image_url, ...gallery.map((g) => g.image_url)].filter(Boolean)

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="pdp">
      <div>
        <div className="pdp-gallery-main">
          {activeImg && <img src={activeImg} alt={pick(product, 'name')} />}
        </div>
        {allImages.length > 1 && (
          <div className="pdp-thumbs">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className={img === activeImg ? 'active' : ''}
                onClick={() => setActiveImg(img)}
                alt=""
              />
            ))}
          </div>
        )}
      </div>
      <div className="pdp-info">
        <h1>{pick(product, 'name')}</h1>
        <div className="pdp-price">
          {product.discount_price ? (
            <>
              <span className="old">{product.price} ج.م</span>
              {product.discount_price} ج.م
            </>
          ) : (
            <>{product.price} ج.م</>
          )}
        </div>
        {pick(product, 'description') && (
          <div className="pdp-desc">{pick(product, 'description')}</div>
        )}
        <div className="qty-row">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          {added ? t.product.addedToCart : t.product.addToCart}
        </button>
      </div>
    </div>
  )
}
