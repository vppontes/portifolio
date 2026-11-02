import { useContext } from 'react'
import { ThemeContext } from './theme-context'

export function useTheme() {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.')
  }
  return theme
}
