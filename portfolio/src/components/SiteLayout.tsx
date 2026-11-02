import { Link, Outlet } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

export function SiteLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Portfólio CP3 FIAP, página inicial">
          CP3<span>.</span>
        </Link>
        <nav aria-label="Navegação principal">
          <Link to="/">Início</Link>
          <Link to="/projetos">Projetos</Link>
          <Link to="/contato">Contato</Link>
          <Link to="/login">Painel</Link>
        </nav>
        <div className="header-actions">
          <a
            className="github-profile-link"
            href="https://github.com/vppontes"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>Portfólio CP3 FIAP · Victor Pontes</span>
        <a href="mailto:victor.ppontes12@gmail.com">
          victor.ppontes12@gmail.com
        </a>
      </footer>
    </div>
  )
}
