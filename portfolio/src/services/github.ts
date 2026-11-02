export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  updated_at: string
  homepage: string | null
  owner: {
    login: string
  }
}

const FEATURED_REPOSITORIES = [
  { owner: 'vppontes', name: 'Inserir-Perguntas' },
  { owner: 'SAVAC-Challenge-FIAP', name: 'sprint4-front-webDev' },
]

const README_DESCRIPTIONS: Record<string, string> = {
  'SAVAC-Challenge-FIAP/sprint4-front-webDev':
    'Landing page do Synesthesia, uma proposta de recurso para a câmera JOVI que transforma fotos em conteúdo para compartilhar e recomenda músicas com prévias de áudio.',
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

export function fetchFeaturedRepositories() {
  return Promise.all(
    FEATURED_REPOSITORIES.map(({ owner, name }) =>
      fetchGitHubJson<GitHubRepository>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
      ),
    ),
  ).then((repositories) =>
    repositories.map((repository) => ({
      ...repository,
      description:
        repository.description ??
        README_DESCRIPTIONS[repository.full_name] ??
        null,
    })),
  )
}

export function fetchRepository(owner: string, name: string) {
  return fetchGitHubJson<GitHubRepository>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
  )
}
