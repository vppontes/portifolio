import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../components/ContactForm'
import { submitContactMessage } from '../services/contact'

vi.mock('../services/contact', () => ({
  submitContactMessage: vi.fn(),
}))

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates the name field individually', () => {
    render(<ContactForm />)

    fireEvent.blur(screen.getByRole('textbox', { name: /Nome/ }))

    expect(screen.getByText('Este campo é obrigatório.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Nome/ })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('validates the email field individually', () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByRole('textbox', { name: /E-mail/ }), {
      target: { value: 'endereco-invalido' },
    })
    fireEvent.blur(screen.getByRole('textbox', { name: /E-mail/ }))

    expect(
      screen.getByText('Informe um endereço de e-mail válido.'),
    ).toBeInTheDocument()
  })

  it('validates the message field individually', () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByRole('textbox', { name: /Mensagem/ }), {
      target: { value: 'Curta' },
    })
    fireEvent.blur(screen.getByRole('textbox', { name: /Mensagem/ }))

    expect(
      screen.getByText('A mensagem deve ter pelo menos 10 caracteres.'),
    ).toBeInTheDocument()
  })

  it('submits valid data and shows confirmation', async () => {
    vi.mocked(submitContactMessage).mockResolvedValueOnce()
    render(<ContactForm />)

    fireEvent.change(screen.getByRole('textbox', { name: /Nome/ }), {
      target: { value: 'Victor Pontes' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /E-mail/ }), {
      target: { value: 'victor@example.com' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /Mensagem/ }), {
      target: { value: 'Olá, gostaria de conversar.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Mensagem enviada. Obrigado pelo contato!',
    )
    expect(submitContactMessage).toHaveBeenCalledWith({
      name: 'Victor Pontes',
      email: 'victor@example.com',
      message: 'Olá, gostaria de conversar.',
    })
  })
})
