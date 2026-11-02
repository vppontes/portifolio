import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../context/auth-context'
import { ProtectedRoute } from '../components/ProtectedRoute'

describe('ProtectedRoute', () => {
  it('redirects unauthenticated visitors to the login page', () => {
    const unauthenticatedAuth: AuthContextValue = {
      session: null,
      isLoading: false,
      error: null,
      signIn: vi.fn(),
      signOut: vi.fn(),
    }

    render(
      <AuthContext.Provider value={unauthenticatedAuth}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<h1>Entrar</h1>} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={<h1>Conteúdo privado</h1>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    expect(
      screen.getByRole('heading', { name: 'Entrar' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Conteúdo privado' }),
    ).not.toBeInTheDocument()
  })
})
