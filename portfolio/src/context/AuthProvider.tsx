import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthContext } from './auth-context'
import { getSupabaseClient } from '../services/supabase'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthState {
  session: Session | null
  isLoading: boolean
  error: string | null
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Ocorreu um erro inesperado na autenticação.'
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [clientState] = useState(() => {
    try {
      return { client: getSupabaseClient(), error: null }
    } catch (error: unknown) {
      return { client: null, error: getErrorMessage(error) }
    }
  })
  const [authState, setAuthState] = useState<AuthState>(() => ({
    session: null,
    isLoading: clientState.client !== null,
    error: clientState.error,
  }))

  useEffect(() => {
    if (!clientState.client) {
      return
    }

    let isActive = true
    const { data } = clientState.client.auth.onAuthStateChange(
      (_event, session) => {
        if (isActive) {
          setAuthState({ session, isLoading: false, error: null })
        }
      },
    )

    void clientState.client.auth
      .getSession()
      .then(({ data: sessionData, error }) => {
        if (error) {
          throw error
        }
        if (isActive) {
          setAuthState({
            session: sessionData.session,
            isLoading: false,
            error: null,
          })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setAuthState({
            session: null,
            isLoading: false,
            error: getErrorMessage(error),
          })
        }
      })

    return () => {
      isActive = false
      data.subscription.unsubscribe()
    }
  }, [clientState.client])

  async function signIn(email: string, password: string) {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      throw error
    }
  }

  async function signOut() {
    const { error } = await getSupabaseClient().auth.signOut()
    if (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ ...authState, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
