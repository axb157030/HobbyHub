import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// These public browser settings are safe to expose; never put the service-role key here.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

let anonymousSignInPromise

export const ensureAnonymousSession = async () => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) return { data: null, error: sessionError }
  if (sessionData.session) return { data: sessionData.session, error: null }

  if (!anonymousSignInPromise) {
    // Reuse one sign-in request if several parts of the page need a session at once.
    anonymousSignInPromise = supabase.auth
      .signInAnonymously()
      .then(
        ({ data, error }) => {
          anonymousSignInPromise = null
          return { data: data.session, error }
        },
        (error) => {
          anonymousSignInPromise = null
          return { data: null, error }
        },
      )
  }

  return anonymousSignInPromise
}
