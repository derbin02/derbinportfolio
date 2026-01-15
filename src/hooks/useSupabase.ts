import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured, DBProject, getProjects, getFeaturedProjects, submitContactForm } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

// Hook for fetching projects
export function useProjects() {
  const [projects, setProjects] = useState<DBProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      setError('Failed to fetch projects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { projects, loading, error, refetch: fetchProjects }
}

// Hook for featured projects
export function useFeaturedProjects() {
  const [projects, setProjects] = useState<DBProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      try {
        const data = await getFeaturedProjects()
        setProjects(data)
      } catch (err) {
        setError('Failed to fetch featured projects')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { projects, loading, error }
}

// Hook for contact form submission
export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const submit = async (name: string, email: string, message: string) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage(null)

    try {
      const result = await submitContactForm(name, email, message)
      if (result.success) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Failed to submit form')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setSubmitStatus('idle')
    setErrorMessage(null)
  }

  return { submit, isSubmitting, submitStatus, errorMessage, reset }
}

// Hook for authentication
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError }
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    if (!supabase) {
      return { error: null }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isSupabaseConfigured,
  }
}

// Hook for real-time subscription to projects
export function useRealtimeProjects() {
  const [projects, setProjects] = useState<DBProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    getProjects().then((data) => {
      setProjects(data)
      setLoading(false)
    })

    if (!supabase) return

    // Subscribe to changes
    const subscription = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        async () => {
          // Refetch all projects on any change
          const data = await getProjects()
          setProjects(data)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { projects, loading }
}

export default useAuth
