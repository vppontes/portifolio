import { ContactForm } from '../components/ContactForm'

export function ContactPage() {
  return (
    <section className="content-page contact-page">
      <p className="eyebrow">Vamos conversar</p>
      <h1>Fale comigo</h1>
      <p>
        Se quiser conversar sobre algum projeto, escreva pelo formulário ou{' '}
        mande um e-mail para{' '}
        <a className="text-link" href="mailto:victor.ppontes12@gmail.com">
          victor.ppontes12@gmail.com
        </a>
        .
      </p>
      <ContactForm />
    </section>
  )
}
