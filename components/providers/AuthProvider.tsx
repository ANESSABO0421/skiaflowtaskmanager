'use client'

import { useEffect } from 'react'

import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

const supabase = createClient()

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const setUser = useAuthStore(
    (state) => state.setUser
  )

  const setSession = useAuthStore(
    (state) => state.setSession
  )

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setUser(session?.user ?? null)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setSession, setUser])

  return <>{children}</>
}