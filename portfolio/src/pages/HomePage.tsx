import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { RepositoryList } from '../components/RepositoryList'
import { fetchFeaturedRepositories } from '../services/github'

export function HomePage() {
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
    <div className="home-page">
      <section className="hero-section">
        <p className="eyebrow">FIAP · CP3</p>
        <h1>Olá, eu sou Victor Pontes.</h1>
        <p className="hero-copy">
          Este é meu portfólio: um espaço para apresentar meus projetos e o que
          venho construindo.
        </p>
        <div className="hero-actions">
          <Link className="button" to="/projetos">
            Explorar projetos
          </Link>
          <Link className="button button-secondary" to="/contato">
            Entre em contato
          </Link>
        </div>
      </section>
      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Trabalho selecionado</p>
            <h2 id="featured-heading">Projetos</h2>
          </div>
          <Link className="text-link" to="/projetos">
            Ver todos
          </Link>
        </div>
        {isPending && <p role="status">Carregando projetos do GitHub...</p>}
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
    </div>
  )
}
