import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getAdminRole,
  getAdminToken,
  loginAdmin,
  logoutAdmin,
  type UserRole,
} from '../services/submissions'

interface AuthContextValue {
  isAuthenticated: boolean
  role: UserRole | null
  canManage: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(getAdminToken()),
  )
  const [role, setRole] = useState<UserRole | null>(() => getAdminRole())

  const login = useCallback(async (username: string, password: string) => {
    const result = await loginAdmin(username, password)
    setIsAuthenticated(result.ok)
    setRole(result.ok ? result.role : null)
    return result.ok
  }, [])

  const logout = useCallback(async () => {
    await logoutAdmin()
    setIsAuthenticated(false)
    setRole(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      role,
      canManage: role === 'admin',
      login,
      logout,
    }),
    [isAuthenticated, role, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
