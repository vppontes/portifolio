import { getSupabaseClient } from './supabase'

export async function fetchFeaturedProjects(): Promise<string[]> {
  const { data, error } = await getSupabaseClient()
    .from('featured_projects')
    .select('repo_full_name')
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data.map(({ repo_full_name }) => repo_full_name)
}

export async function setFeaturedProject(
  repoFullName: string,
  isFeatured: boolean,
) {
  const supabase = getSupabaseClient()
  const result = isFeatured
    ? await supabase
        .from('featured_projects')
        .upsert({ repo_full_name: repoFullName }, { onConflict: 'repo_full_name' })
    : await supabase
        .from('featured_projects')
        .delete()
        .eq('repo_full_name', repoFullName)

  if (result.error) {
    throw result.error
  }
}
