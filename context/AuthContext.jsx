'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = still checking
  const [profile, setProfile] = useState(null)

  async function loadProfile(userId, email) {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data } = await supabase.from('customer_profiles').select('*').eq('id', userId).maybeSingle()
    if (data) {
      setProfile(data)
      return
    }
    // بروفايل ناقص (مثلاً بسبب حساب اتعمل وقت ما كان تأكيد الإيميل شغال) — نصلحه تلقائي
    const { data: created } = await supabase
      .from('customer_profiles')
      .upsert({ id: userId, email }, { onConflict: 'id' })
      .select()
      .single()
    setProfile(created || null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      loadProfile(data.session?.user?.id, data.session?.user?.email)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      loadProfile(s?.user?.id, s?.user?.email)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signUp({ email, password, fullName, phone, governorate, address, shippingZoneId }) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }
    const userId = data.user?.id
    if (userId) {
      await supabase.from('customer_profiles').upsert({
        id: userId,
        full_name: fullName,
        email,
        phone,
        governorate,
        address,
        shipping_zone_id: shippingZoneId || null,
      }, { onConflict: 'id' })
      await loadProfile(userId, email)
    }
    return { data }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading: session === undefined, signUp, signIn, signOut, refreshProfile: () => loadProfile(session?.user?.id, session?.user?.email) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
