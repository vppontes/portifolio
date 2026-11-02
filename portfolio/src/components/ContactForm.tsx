import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  validateContactField,
  validateContactForm,
  type ContactField,
  type ContactFormErrors,
  type ContactFormValues,
} from '../services/contact-validation'
import { submitContactMessage } from '../services/contact'

const INITIAL_VALUES: ContactFormValues = {
  name: '',
  email: '',
  message: '',
}

export function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    message: string
    isError: boolean
  } | null>(null)

  function handleChange(
    field: ContactField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const value = event.target.value
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateContactField(field, value),
      }))
    }
  }

  function handleBlur(field: ContactField) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateContactField(field, values[field]),
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)
    const formErrors = validateContactForm(values)
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      await submitContactMessage(values)
      setValues(INITIAL_VALUES)
      setErrors({})
      setFeedback({
        message: 'Mensagem enviada. Obrigado pelo contato!',
        isError: false,
      })
    } catch (error: unknown) {
      console.error('Failed to save contact message.', error)
      setFeedback({
        message:
          'Não foi possível enviar sua mensagem. Tente novamente em alguns instantes.',
        isError: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <label htmlFor="contact-name">Nome</label>
      <input
        id="contact-name"
        name="name"
        type="text"
        autoComplete="name"
        maxLength={100}
        value={values.name}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? 'contact-name-error' : undefined}
        onChange={(event) => handleChange('name', event)}
        onBlur={() => handleBlur('name')}
        required
      />
      {errors.name && (
        <p className="field-error" id="contact-name-error" role="alert">
          {errors.name}
        </p>
      )}

      <label htmlFor="contact-email">E-mail</label>
      <input
        id="contact-email"
        name="email"
        type="email"
        autoComplete="email"
        maxLength={254}
        value={values.email}
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? 'contact-email-error' : undefined}
        onChange={(event) => handleChange('email', event)}
        onBlur={() => handleBlur('email')}
        required
      />
      {errors.email && (
        <p className="field-error" id="contact-email-error" role="alert">
          {errors.email}
        </p>
      )}

      <label htmlFor="contact-message">Mensagem</label>
      <textarea
        id="contact-message"
        name="message"
        rows={6}
        maxLength={5000}
        value={values.message}
        aria-invalid={Boolean(errors.message)}
        aria-describedby={
          errors.message ? 'contact-message-error' : 'contact-message-hint'
        }
        onChange={(event) => handleChange('message', event)}
        onBlur={() => handleBlur('message')}
        required
      />
      {errors.message ? (
        <p className="field-error" id="contact-message-error" role="alert">
          {errors.message}
        </p>
      ) : (
        <p className="field-hint" id="contact-message-hint">
          Escreva pelo menos 10 caracteres.
        </p>
      )}

      {feedback && (
        <p
          className={feedback.isError ? 'form-feedback form-feedback-error' : 'form-feedback'}
          role={feedback.isError ? 'alert' : 'status'}
        >
          {feedback.message}
        </p>
      )}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
      </button>
    </form>
  )
}
