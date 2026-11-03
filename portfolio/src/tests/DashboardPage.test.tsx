import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../context/auth-context'
import { DashboardPage } from '../pages/DashboardPage'
import {
  checkAdminAccess,
  fetchContactMessages,
  setContactMessageAnswered,
} from '../services/admin'
import { fetchPortfolioRepositories } from '../services/github'
import {
  fetchFeaturedProjects,
  setFeaturedProject,
} from '../services/featured-projects'

vi.mock('../services/admin', () => ({
  checkAdminAccess: vi.fn(),
  fetchContactMessages: vi.fn(),
  setContactMessageAnswered: vi.fn(),
}))
vi.mock('../services/github', () => ({
  fetchPortfolioRepositories: vi.fn(),
}))
vi.mock('../services/featured-projects', () => ({
  fetchFeaturedProjects: vi.fn(),
  setFeaturedProject: vi.fn(),
}))

const authenticatedAdmin: AuthContextValue = {
  session: {
    access_token: 'test-token',
    refresh_token: 'test-refresh-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: 4_102_444_800,
    user: {
      id: 'admin-user',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2026-01-01T00:00:00.000Z',
    },
  },
  isLoading: false,
  error: null,
  signIn: vi.fn(),
  signOut: vi.fn(),
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkAdminAccess).mockResolvedValue(true)
    vi.mocked(fetchContactMessages).mockResolvedValue([
      {
        id: 'message-1',
        name: 'Pessoa visitante',
        email: 'visitor@example.com',
        message: 'Gostaria de falar sobre um projeto.',
        is_answered: false,
        created_at: '2026-10-01T12:00:00.000Z',
      },
    ])
    vi.mocked(setContactMessageAnswered).mockResolvedValue()
    vi.mocked(fetchPortfolioRepositories).mockResolvedValue([
      {
        id: 1,
        name: 'featured-repo',
        full_name: 'vppontes/featured-repo',
        description: 'Um projeto em destaque.',
        html_url: 'https://github.com/vppontes/featured-repo',
        language: 'TypeScript',
        updated_at: '2026-10-01T12:00:00.000Z',
        homepage: null,
        fork: false,
        owner: { login: 'vppontes' },
      },
    ])
    vi.mocked(fetchFeaturedProjects).mockResolvedValue([])
    vi.mocked(setFeaturedProject).mockResolvedValue()
  })

  it('lists contact messages and marks a message as answered', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authenticatedAdmin}>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Pessoa visitante')).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: 'Marcar como respondida' }),
    )

    await waitFor(() => {
      expect(setContactMessageAnswered).toHaveBeenCalledWith(
        'message-1',
        true,
      )
    })
  })

  it('does not fetch or display messages for a non-admin user', async () => {
    vi.mocked(checkAdminAccess).mockResolvedValue(false)
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authenticatedAdmin}>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>,
    )

    expect(
      await screen.findByText(/Esta conta não tem permissão administrativa/),
    ).toBeInTheDocument()
    expect(fetchContactMessages).not.toHaveBeenCalled()
    expect(screen.queryByText('Pessoa visitante')).not.toBeInTheDocument()
  })

  it('lets an admin feature a public repository on the home page', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authenticatedAdmin}>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>,
    )

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Destacar na página inicial',
      }),
    )

    await waitFor(() => {
      expect(setFeaturedProject).toHaveBeenCalledWith(
        'vppontes/featured-repo',
        true,
      )
    })
  })
})
