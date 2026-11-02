import { useQuery } from '@tanstack/react-query'
import { RepositoryList } from '../components/RepositoryList'
import { fetchPortfolioRepositories } from '../services/github'

export function ProjectsPage() {
  const {
    data: repositories,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['github', 'portfolio-repositories'],
    queryFn: fetchPortfolioRepositories,
  })

  return (
    <section className="content-page">
      <p className="eyebrow">GitHub</p>
      <h1>Projetos</h1>
      <p>
        Reúno projetos e estudos que estão no meu GitHub, incluindo trabalhos
        da FIAP.
      </p>
      {isPending && <p role="status">Carregando projetos...</p>}
      {error && (
        <div className="notice" role="alert">
          <p>{error.message}</p>
          <button className="text-button" onClick={() => void refetch()}>
            Tentar novamente
          </button>
        </div>
      )}
      {repositories && <RepositoryList repositories={repositories} />}
    </section>
  )
}
