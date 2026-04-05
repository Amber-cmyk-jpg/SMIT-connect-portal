import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '../features/auth/authSlice'
import { supabase } from '../utils/supabaseClient'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, role, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data }) => dispatch({ type: 'auth/setUser', payload: { user: session.user, role: data?.role } }))
      } else {
        dispatch({ type: 'auth/logOut' })
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [dispatch])

  return { user, role, isLoading }
}

