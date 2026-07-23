import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const AUTH_KEY = 'peninsula_admin_auth'

/** Credenciales de demostración — cámbialas en producción */
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'peninsula2026',
}

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readAuth(): boolean {
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth)

  const login = useCallback((username: string, password: string) => {
    const ok =
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    if (ok) {
      localStorage.setItem(AUTH_KEY, '1')
      setIsAuthenticated(true)
    }
    return ok
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
