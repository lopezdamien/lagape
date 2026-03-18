import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function isTokenValid(token) {
  if (!token) return false
  const [expires] = token.split('.')
  if (!expires) return false
  return Date.now() < parseInt(expires, 10)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('lagape_token')
    return isTokenValid(t) ? t : null
  })

  function login(t) {
    localStorage.setItem('lagape_token', t)
    setToken(t)
  }

  function logout() {
    localStorage.removeItem('lagape_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
