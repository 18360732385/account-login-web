import { useCallback, useState } from 'react'
import { ApiError, fetchMe, login } from './api/client'
import type { LoginResponse, MeResponse } from './api/types'
import { LoginForm } from './components/LoginForm'
import { ProfileView } from './components/ProfileView'
import './App.css'

type Session = {
  token: LoginResponse
  me: MeResponse
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = useCallback(async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = await login({ username, password })
      const me = await fetchMe(token.accessToken)
      setSession({ token, me })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : '登录失败'
      setError(message)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = useCallback(() => {
    setSession(null)
    setError(null)
  }, [])

  return (
    <main className="app">
      {session ? (
        <ProfileView me={session.me} token={session.token} onLogout={handleLogout} />
      ) : (
        <LoginForm onSubmit={handleLogin} disabled={loading} error={error} />
      )}
    </main>
  )
}
