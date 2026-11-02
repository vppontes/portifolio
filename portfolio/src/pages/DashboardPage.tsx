import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/use-auth'

export function DashboardPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSignOut() {
    setError(null)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (signOutError: unknown) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : 'Não foi possível encerrar a sessão.',
      )
    }
  }

  return (
    <section className="content-page">
      <p className="eyebrow">Área administrativa</p>
      <h1>Painel</h1>
      <p>A gestão de mensagens e projetos será conectada ao Supabase.</p>
      {error && <p role="alert">{error}</p>}
      <button className="button button-secondary" onClick={handleSignOut}>
        Sair
      </button>
    </section>
  )
}
