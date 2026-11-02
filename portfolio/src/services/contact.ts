import { getSupabaseClient } from './supabase'
import type { ContactFormValues } from './contact-validation'

export async function submitContactMessage(values: ContactFormValues) {
  const supabase = getSupabaseClient()
  const message = {
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  }

  const { error: insertError } = await supabase
    .from('contact_messages')
    .insert(message)

  if (insertError) {
    throw insertError
  }
}
