export type ContactField = 'name' | 'email' | 'message'

export type ContactFormValues = Record<ContactField, string>
export type ContactFormErrors = Partial<Record<ContactField, string>>

export function validateContactField(
  field: ContactField,
  value: string,
): string | undefined {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'Este campo é obrigatório.'
  }

  if (field === 'name' && trimmedValue.length < 2) {
    return 'Informe pelo menos 2 caracteres.'
  }

  if (field === 'name' && trimmedValue.length > 100) {
    return 'O nome deve ter no máximo 100 caracteres.'
  }

  if (field === 'email') {
    if (trimmedValue.length > 254) {
      return 'O e-mail deve ter no máximo 254 caracteres.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return 'Informe um endereço de e-mail válido.'
    }
  }

  if (field === 'message' && trimmedValue.length < 10) {
    return 'A mensagem deve ter pelo menos 10 caracteres.'
  }

  if (field === 'message' && trimmedValue.length > 5000) {
    return 'A mensagem deve ter no máximo 5000 caracteres.'
  }

  return undefined
}

export function validateContactForm(values: ContactFormValues) {
  return (Object.keys(values) as ContactField[]).reduce<ContactFormErrors>(
    (errors, field) => {
      const error = validateContactField(field, values[field])
      if (error) {
        errors[field] = error
      }
      return errors
    },
    {},
  )
}
