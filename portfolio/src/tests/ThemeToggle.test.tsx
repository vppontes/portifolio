import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from '../context/ThemeProvider'
import { ThemeToggle } from '../components/ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('switches between light and dark themes and persists the preference', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    expect(document.documentElement.dataset.theme).toBe('dark')
    fireEvent.click(screen.getByRole('button', { name: 'Ativar tema claro' }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('portfolio-theme')).toBe('light')
    expect(
      screen.getByRole('button', { name: 'Ativar tema escuro' }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('portfolio-theme')).toBe('dark')
  })

  it('restores a saved theme preference', () => {
    localStorage.setItem('portfolio-theme', 'light')

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(
      screen.getByRole('button', { name: 'Ativar tema escuro' }),
    ).toBeInTheDocument()
  })
})
