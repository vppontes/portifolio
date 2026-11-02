import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="content-page">
      <p className="eyebrow">Erro 404</p>
      <h1>Página não encontrada.</h1>
      <Link className="button" to="/">
        Voltar ao início
      </Link>
    </section>
  )
}
