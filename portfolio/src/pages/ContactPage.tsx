import { ContactForm } from '../components/ContactForm'

export function ContactPage() {
  return (
    <section className="content-page contact-page">
      <p className="eyebrow">Vamos conversar</p>
      <h1>Entre em contato.</h1>
      <p>
        Envie uma mensagem pelo formulário ou escreva diretamente para{' '}
        <a className="text-link" href="mailto:victor.ppontes12@gmail.com">
          victor.ppontes12@gmail.com
        </a>
        .
      </p>
      <ContactForm />
    </section>
  )
}
