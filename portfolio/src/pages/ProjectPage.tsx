import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchRepository } from '../services/github'

export function ProjectPage() {
  const { owner, repo } = useParams()
  const {
    data: repository,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['github', 'repository', owner, repo],
    queryFn: () => fetchRepository(owner ?? '', repo ?? ''),
    enabled: Boolean(owner && repo),
  })

  return (
    <section className="content-page">
      <p className="eyebrow">Projeto do GitHub</p>
      {isPending && <p role="status">Carregando detalhes do projeto...</p>}
      {error && (
        <div className="notice" role="alert">
          <p>{error.message}</p>
          <button className="text-button" onClick={() => void refetch()}>
            Tentar novamente
          </button>
        </div>
      )}
      {repository && (
        <>
          <h1>{repository.name}</h1>
          <p>{repository.description ?? 'Descrição não cadastrada no GitHub.'}</p>
          <dl className="project-details">
            <div>
              <dt>Repositório</dt>
              <dd>{repository.full_name}</dd>
            </div>
            <div>
              <dt>Linguagem principal</dt>
              <dd>{repository.language ?? 'Não informada'}</dd>
            </div>
            <div>
              <dt>Última atualização</dt>
              <dd>
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'long',
                }).format(new Date(repository.updated_at))}
              </dd>
            </div>
          </dl>
          <div className="project-actions">
            <a
              className="button"
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
            >
              Ver no GitHub
            </a>
            {repository.homepage && (
              <a
                className="button button-secondary"
                href={repository.homepage}
                target="_blank"
                rel="noreferrer"
              >
                Ver projeto publicado
              </a>
            )}
          </div>
        </>
      )}
      <Link className="text-link" to="/projetos">
        Voltar aos projetos
      </Link>
    </section>
  )
}
