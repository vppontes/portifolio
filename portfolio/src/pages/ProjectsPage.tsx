import { useQuery } from '@tanstack/react-query'
import { RepositoryList } from '../components/RepositoryList'
import { fetchFeaturedRepositories } from '../services/github'

export function ProjectsPage() {
  const {
    data: repositories,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['github', 'featured-repositories'],
    queryFn: fetchFeaturedRepositories,
  })

  return (
    <section className="content-page">
      <p className="eyebrow">GitHub</p>
      <h1>Projetos</h1>
      <p>Repositórios públicos selecionados, carregados diretamente do GitHub.</p>
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
