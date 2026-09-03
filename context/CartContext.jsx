'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wanas_cart')
    if (saved) setItems(JSON.parse(saved))
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem('wanas_cart', JSON.stringify(items))
  }, [items, loaded])

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [
        ...prev,
        {
          id: product.id,
          name_ar: product.name_ar,
          name_en: product.name_en,
          price: product.discount_price || product.price,
          image_url: product.image_url,
          qty,
        },
      ]
    })
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQty(id, qty) {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
