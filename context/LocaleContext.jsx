'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import ar from '../dictionaries/ar.json'
import en from '../dictionaries/en.json'

const dictionaries = { ar, en }
const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('ar')

  useEffect(() => {
    const saved = localStorage.getItem('wanas_locale')
    if (saved) setLocale(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('wanas_locale', locale)
  }, [locale])

  const dict = dictionaries[locale]

  function toggleLocale() {
    setLocale((l) => (l === 'ar' ? 'en' : 'ar'))
  }

  // pick(product, 'name') => product.name_ar or product.name_en depending on locale
  function pick(obj, field) {
    if (!obj) return ''
    return obj[`${field}_${locale}`] ?? ''
  }

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t: dict, pick }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
