import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      supabase.auth.setSession({ access_token, refresh_token }).then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
        window.history.replaceState(null, '', '/')
      })
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
    }

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  if (loading) return <div style={{padding:'40px'}}>Cargando...</div>

  if (user) return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Bienvenido {user.email}</h1>
      <button onClick={() => supabase.auth.signOut().then(() => setUser(null))}>Cerrar sesion</button>
    </div>
  )

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Craving Health</h1>
      <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}>
        Continuar con Google
      </button>
    </div>
  )
}

export default App