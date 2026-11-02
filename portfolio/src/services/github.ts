export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  updated_at: string
  homepage: string | null
  fork: boolean
  owner: {
    login: string
  }
}

export interface GitHubProfile {
  name: string | null
  login: string
  avatar_url: string
  html_url: string
  location: string | null
  bio: string | null
}

const GITHUB_USERNAME = 'vppontes'
const PORTFOLIO_REPOSITORY = 'vppontes/portifolio'
const TEAM_REPOSITORY = {
  owner: 'SAVAC-Challenge-FIAP',
  name: 'sprint4-front-webDev',
}

async function fetchGitHubJson<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        'O GitHub limitou temporariamente as consultas. Tente novamente em alguns minutos.',
      )
    }
    if (response.status === 404) {
      throw new Error('Este repositório não está disponível publicamente.')
    }
    throw new Error(`Não foi possível carregar o GitHub (HTTP ${response.status}).`)
  }

  return (await response.json()) as T
}

export function fetchGitHubProfile() {
  return fetchGitHubJson<GitHubProfile>(
    `/users/${encodeURIComponent(GITHUB_USERNAME)}`,
  )
}

export async function fetchPortfolioRepositories() {
  const [repositories, teamRepository] = await Promise.all([
    fetchGitHubJson<GitHubRepository[]>(
      `/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated`,
    ),
    fetchGitHubJson<GitHubRepository>(
      `/repos/${encodeURIComponent(TEAM_REPOSITORY.owner)}/${encodeURIComponent(TEAM_REPOSITORY.name)}`,
    ),
  ])

  return [...repositories, teamRepository]
    .filter(
      (repository) =>
        !repository.fork && repository.full_name !== PORTFOLIO_REPOSITORY,
    )
    .sort(
      (firstRepository, secondRepository) =>
        Date.parse(secondRepository.updated_at) -
        Date.parse(firstRepository.updated_at),
    )
}

export function fetchRepository(owner: string, name: string) {
  return fetchGitHubJson<GitHubRepository>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
  )
}
