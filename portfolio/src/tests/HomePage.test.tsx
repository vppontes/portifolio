import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from '../pages/HomePage'
import { fetchPortfolioRepositories, fetchGitHubProfile } from '../services/github'
import { fetchFeaturedProjects } from '../services/featured-projects'

vi.mock('../services/github', () => ({
  fetchGitHubProfile: vi.fn(),
  fetchPortfolioRepositories: vi.fn(),
}))
vi.mock('../services/featured-projects', () => ({
  fetchFeaturedProjects: vi.fn(),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchGitHubProfile).mockResolvedValue({
      name: 'Victor Pontes',
      login: 'vppontes',
      avatar_url: 'https://github.com/vppontes.png',
      html_url: 'https://github.com/vppontes',
      location: null,
      bio: null,
    })
    vi.mocked(fetchPortfolioRepositories).mockResolvedValue([
      {
        id: 1,
        name: 'featured-repo',
        full_name: 'vppontes/featured-repo',
        description: 'Projeto selecionado.',
        html_url: 'https://github.com/vppontes/featured-repo',
        language: 'TypeScript',
        updated_at: '2026-10-01T12:00:00.000Z',
        homepage: null,
        fork: false,
        owner: { login: 'vppontes' },
      },
      {
        id: 2,
        name: 'other-repo',
        full_name: 'vppontes/other-repo',
        description: 'Projeto não selecionado.',
        html_url: 'https://github.com/vppontes/other-repo',
        language: 'JavaScript',
        updated_at: '2026-09-01T12:00:00.000Z',
        homepage: null,
        fork: false,
        owner: { login: 'vppontes' },
      },
    ])
    vi.mocked(fetchFeaturedProjects).mockResolvedValue([
      'vppontes/featured-repo',
    ])
  })

  it('shows only repositories selected as featured', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(
      await screen.findByRole('heading', { name: 'featured-repo' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'other-repo' }),
    ).not.toBeInTheDocument()
  })
})
