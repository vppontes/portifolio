import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchGitHubProfile,
  fetchPortfolioRepositories,
  type GitHubRepository,
} from '../services/github'

function createRepository(
  name: string,
  updatedAt: string,
  options: { fork?: boolean; fullName?: string } = {},
): GitHubRepository {
  return {
    id: name.length,
    name,
    full_name: options.fullName ?? `vppontes/${name}`,
    description: null,
    html_url: `https://github.com/vppontes/${name}`,
    language: 'TypeScript',
    updated_at: updatedAt,
    homepage: null,
    fork: options.fork ?? false,
    owner: { login: 'vppontes' },
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('GitHub API service', () => {
  it('fetches the public profile and its avatar', async () => {
    const profile = {
      name: 'Victor Pontes',
      login: 'vppontes',
      avatar_url: 'https://avatars.githubusercontent.com/u/149399268?v=4',
      html_url: 'https://github.com/vppontes',
      location: 'São Paulo',
      bio: null,
    }
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(profile), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchGitHubProfile()).resolves.toEqual(profile)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/users/vppontes',
      { headers: { Accept: 'application/vnd.github+json' } },
    )
  })

  it('lists owned non-fork projects plus the team project, excluding this portfolio', async () => {
    const ownRepositories = [
      createRepository('older-project', '2026-01-01T00:00:00Z'),
      createRepository('forked-project', '2026-10-01T00:00:00Z', {
        fork: true,
      }),
      createRepository('portifolio', '2026-11-01T00:00:00Z', {
        fullName: 'vppontes/portifolio',
      }),
    ]
    const teamRepository: GitHubRepository = {
      ...createRepository('sprint4-front-webDev', '2026-09-01T00:00:00Z', {
        fullName: 'SAVAC-Challenge-FIAP/sprint4-front-webDev',
      }),
      owner: { login: 'SAVAC-Challenge-FIAP' },
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(ownRepositories), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(teamRepository), { status: 200 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    const repositories = await fetchPortfolioRepositories()

    expect(repositories.map((repository) => repository.full_name)).toEqual([
      'SAVAC-Challenge-FIAP/sprint4-front-webDev',
      'vppontes/older-project',
    ])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('reports GitHub rate-limit errors explicitly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 403 })),
    )

    await expect(fetchGitHubProfile()).rejects.toThrow(
      'O GitHub limitou temporariamente as consultas.',
    )
  })
})
