import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/use-auth'

export function ProtectedRoute() {
  const { isLoading, session } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p role="status">Verificando autenticação...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
