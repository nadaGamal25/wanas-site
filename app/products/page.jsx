import { Suspense } from 'react'
import ProductsContent from './ProductsContent'

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="empty-state">...</div>}>
      <ProductsContent />
    </Suspense>
  )
}