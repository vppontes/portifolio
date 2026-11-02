import { useTheme } from '../context/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'dark' ? 'claro' : 'escuro'

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Ativar tema ${nextTheme}`}
      aria-pressed={theme === 'light'}
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
      Tema {nextTheme}
    </button>
  )
}
