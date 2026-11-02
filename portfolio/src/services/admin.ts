import { getSupabaseClient } from './supabase'

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  is_answered: boolean
  created_at: string
}

export async function checkAdminAccess(userId: string) {
  const { data, error } = await getSupabaseClient()
    .from('portfolio_admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return Boolean(data)
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .select('id, name, email, message, is_answered, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function setContactMessageAnswered(
  messageId: string,
  isAnswered: boolean,
) {
  const { error } = await getSupabaseClient()
    .from('contact_messages')
    .update({ is_answered: isAnswered })
    .eq('id', messageId)

  if (error) {
    throw error
  }
}
