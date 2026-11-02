import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/use-auth'
import {
  checkAdminAccess,
  fetchContactMessages,
  setContactMessageAnswered,
} from '../services/admin'

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Ocorreu um erro inesperado. Tente novamente.'
}

export function DashboardPage() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState<string | null>(null)
  const userId = session?.user.id

  const {
    data: isAdmin,
    isPending: isCheckingAccess,
    error: accessError,
  } = useQuery({
    queryKey: ['admin-access', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('Não foi possível identificar o usuário autenticado.')
      }
      return checkAdminAccess(userId)
    },
    enabled: Boolean(userId),
    retry: false,
  })

  const {
    data: messages,
    isPending: isLoadingMessages,
    error: messagesError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'contact-messages', userId],
    queryFn: fetchContactMessages,
    enabled: isAdmin === true,
  })

  const updateMessage = useMutation({
    mutationFn: ({
      id,
      isAnswered,
    }: {
      id: string
      isAnswered: boolean
    }) => setContactMessageAnswered(id, isAnswered),
    onSuccess: async () => {
      setActionError(null)
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'contact-messages'],
      })
    },
    onError: (error: Error) => {
      setActionError(getErrorMessage(error))
    },
  })

  async function handleSignOut() {
    setActionError(null)
    try {
      await signOut()
      queryClient.removeQueries({ queryKey: ['admin'] })
      queryClient.removeQueries({ queryKey: ['admin-access'] })
      navigate('/login', { replace: true })
    } catch (error: unknown) {
      setActionError(getErrorMessage(error))
    }
  }

  return (
    <section className="content-page dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Área administrativa</p>
          <h1>Painel</h1>
        </div>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => void handleSignOut()}
        >
          Sair
        </button>
      </div>

      {actionError && <p className="notice" role="alert">{actionError}</p>}

      {isCheckingAccess && (
        <p role="status">Verificando permissões administrativas...</p>
      )}

      {accessError && (
        <p className="notice" role="alert">
          Não foi possível verificar seu acesso: {getErrorMessage(accessError)}
        </p>
      )}

      {isAdmin === false && (
        <p className="notice" role="alert">
          Esta conta não tem permissão administrativa. Adicione o ID do usuário
          à tabela portfolio_admins no Supabase.
        </p>
      )}

      {isAdmin && (
        <section aria-labelledby="messages-heading">
          <div className="section-heading dashboard-section-heading">
            <div>
              <p className="eyebrow">Caixa de entrada</p>
              <h2 id="messages-heading">Mensagens recebidas</h2>
            </div>
            <button
              className="text-button"
              type="button"
              onClick={() => void refetch()}
            >
              Atualizar
            </button>
          </div>

          {isLoadingMessages && (
            <p role="status">Carregando mensagens...</p>
          )}

          {messagesError && (
            <p className="notice" role="alert">
              Não foi possível carregar as mensagens:{' '}
              {getErrorMessage(messagesError)}
            </p>
          )}

          {messages?.length === 0 && (
            <p className="notice">Ainda não há mensagens recebidas.</p>
          )}

          {messages && messages.length > 0 && (
            <div className="message-list">
              {messages.map((message) => (
                <article className="message-card" key={message.id}>
                  <div className="message-card-heading">
                    <div>
                      <h3>{message.name}</h3>
                      <a className="text-link" href={`mailto:${message.email}`}>
                        {message.email}
                      </a>
                    </div>
                    <span
                      className={
                        message.is_answered
                          ? 'message-status message-status-answered'
                          : 'message-status'
                      }
                    >
                      {message.is_answered ? 'Respondida' : 'Pendente'}
                    </span>
                  </div>
                  <time dateTime={message.created_at}>
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(message.created_at))}
                  </time>
                  <p className="message-content">{message.message}</p>
                  <button
                    className="button button-secondary message-action"
                    type="button"
                    disabled={updateMessage.isPending}
                    onClick={() => {
                      setActionError(null)
                      updateMessage.mutate({
                        id: message.id,
                        isAnswered: !message.is_answered,
                      })
                    }}
                  >
                    {message.is_answered
                      ? 'Marcar como pendente'
                      : 'Marcar como respondida'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  )
}
