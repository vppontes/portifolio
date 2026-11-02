import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { RepositoryList } from '../components/RepositoryList'
import {
  fetchGitHubProfile,
  fetchPortfolioRepositories,
} from '../services/github'

export function HomePage() {
  const {
    data: repositories,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['github', 'portfolio-repositories'],
    queryFn: fetchPortfolioRepositories,
  })
  const { data: profile } = useQuery({
    queryKey: ['github', 'profile', 'vppontes'],
    queryFn: fetchGitHubProfile,
  })

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy-column">
          <p className="eyebrow">Desenvolvimento de software</p>
          <h1>Victor Pontes</h1>
          <p className="hero-copy">
            Estudante de Engenharia de Software na FIAP, com formação técnica
            em Análise e Desenvolvimento de Sistemas pela ETEC e formação de
            Aspirante a Oficial em Engenharia Militar pelo CPOR/SP.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/projetos">
              Ver projetos
            </Link>
            <Link className="button button-secondary" to="/contato">
              Falar comigo
            </Link>
          </div>
        </div>
        <img
          className="profile-photo"
          src={profile?.avatar_url ?? 'https://github.com/vppontes.png'}
          alt="Foto de Victor Pontes"
          width="220"
          height="220"
          fetchPriority="high"
        />
      </section>
      <section className="about-section" aria-labelledby="about-heading">
        <div>
          <p className="eyebrow">Conhecimentos</p>
          <h2 id="about-heading">Tecnologias e ferramentas</h2>
        </div>
        <div className="about-content">
          <p>
            Tecnologias que fazem parte dos meus estudos e projetos:
          </p>
          <ul className="skill-list" aria-label="Tecnologias e ferramentas">
            {['Python', 'JavaScript', 'HTML', 'MySQL', 'Figma'].map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <div className="social-links">
            <a
              className="text-link"
              href="https://www.linkedin.com/in/vppontes"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="text-link"
              href="https://www.instagram.com/vppontes_/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="text-link"
              href={profile?.html_url ?? 'https://github.com/vppontes'}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Repositórios públicos</p>
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
        {repositories && (
          <RepositoryList repositories={repositories.slice(0, 3)} />
        )}
      </section>
    </div>
  )
}
