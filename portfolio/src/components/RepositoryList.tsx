import { Link } from 'react-router-dom'
import type { GitHubRepository } from '../services/github'

interface RepositoryListProps {
  repositories: GitHubRepository[]
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  if (repositories.length === 0) {
    return <p className="notice">Nenhum projeto encontrado.</p>
  }

  return (
    <div className="repository-grid">
      {repositories.map((repository) => (
        <article className="repository-card" key={repository.id}>
          <div className="repository-card-heading">
            <p className="repository-owner">{repository.owner.login}</p>
            <h2>{repository.name}</h2>
          </div>
          <p className="repository-description">
            {repository.description ?? 'O GitHub não tem descrição cadastrada.'}
          </p>
          <dl className="repository-meta">
            <div>
              <dt>Linguagem</dt>
              <dd>{repository.language ?? 'Não informada'}</dd>
            </div>
            <div>
              <dt>Atualizado</dt>
              <dd>
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'medium',
                }).format(new Date(repository.updated_at))}
              </dd>
            </div>
          </dl>
          <div className="repository-actions">
            <Link
              className="text-link"
              to={`/projetos/${repository.owner.login}/${repository.name}`}
            >
              Ver detalhes
            </Link>
            <a
              className="text-link"
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
            >
              Abrir no GitHub
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}
