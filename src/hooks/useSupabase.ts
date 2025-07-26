import { useEffect, useState } from 'react'
import { createSupabaseClient, isSupabaseReady } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Tables = Database['public']['Tables']
type Peak = Tables['peaks']['Row']
type Trail = Tables['trails']['Row']
type Story = Tables['stories']['Row']
type Expedition = Tables['expeditions']['Row']

// Generic hook for fetching data
function useSupabaseQuery<T>(
  query: () => Promise<{ data: T | null; error: unknown }>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await query()
      if (result.error) {
        setError(result.error instanceof Error ? result.error.message : 'An error occurred')
      } else {
        setData(result.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  const refetch = async () => {
    await fetchData()
  }

  return { data, loading, error, refetch }
}

// Hook for fetching peaks
export function usePeaks() {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<Peak[]>(
    async () => {
      if (!supabase) throw new Error('Supabase not configured')
      return await supabase.from('peaks').select('*').order('elevation', { ascending: false })
    }
  )
}

// Hook for fetching a single peak
export function usePeak(id: string | null) {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<Peak>(
    async () => {
      if (!supabase || !id) throw new Error('Supabase not configured or ID missing')
      return await supabase.from('peaks').select('*').eq('id', id).single()
    },
    [id]
  )
}

// Hook for fetching trails
export function useTrails() {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<(Trail & { peak: Peak | null })[]>(
    async () => {
      if (!supabase) throw new Error('Supabase not configured')
      return await supabase
        .from('trails')
        .select(`
          *,
          peak:peaks(*)
        `)
        .order('name')
    }
  )
}

// Hook for fetching a single trail
export function useTrail(id: string | null) {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<Trail & { peak: Peak | null }>(
    async () => {
      if (!supabase || !id) throw new Error('Supabase not configured or ID missing')
      return await supabase
        .from('trails')
        .select(`
          *,
          peak:peaks(*)
        `)
        .eq('id', id)
        .single()
    },
    [id]
  )
}

// Hook for fetching stories
export function useStories() {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<(Story & { 
    author: { full_name: string | null; avatar_url: string | null }
    peak: Peak | null
    trail: Trail | null
  })[]>(
    async () => {
      if (!supabase) throw new Error('Supabase not configured')
      return await supabase
        .from('stories')
        .select(`
          *,
          author:profiles(full_name, avatar_url),
          peak:peaks(*),
          trail:trails(*)
        `)
        .order('created_at', { ascending: false })
    }
  )
}

// Hook for fetching a single story
export function useStory(id: string | null) {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<Story & { 
    author: { full_name: string | null; avatar_url: string | null }
    peak: Peak | null
    trail: Trail | null
  }>(
    async () => {
      if (!supabase || !id) throw new Error('Supabase not configured or ID missing')
      return await supabase
        .from('stories')
        .select(`
          *,
          author:profiles(full_name, avatar_url),
          peak:peaks(*),
          trail:trails(*)
        `)
        .eq('id', id)
        .single()
    },
    [id]
  )
}

// Hook for fetching expeditions
export function useExpeditions() {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<(Expedition & { 
    organizer: { full_name: string | null; avatar_url: string | null }
  })[]>(
    async () => {
      if (!supabase) throw new Error('Supabase not configured')
      return await supabase
        .from('expeditions')
        .select(`
          *,
          organizer:profiles(full_name, avatar_url)
        `)
        .order('start_date')
    }
  )
}

// Hook for fetching a single expedition
export function useExpedition(id: string | null) {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery<Expedition & { 
    organizer: { full_name: string | null; avatar_url: string | null }
  }>(
    async () => {
      if (!supabase || !id) throw new Error('Supabase not configured or ID missing')
      return await supabase
        .from('expeditions')
        .select(`
          *,
          organizer:profiles(full_name, avatar_url)
        `)
        .eq('id', id)
        .single()
    },
    [id]
  )
}

// Hook for searching across multiple entities
export function useSearch(query: string) {
  const supabase = createSupabaseClient()
  const [results, setResults] = useState<{
    peaks: Peak[]
    trails: Trail[]
    stories: Story[]
    expeditions: Expedition[]
  }>({
    peaks: [],
    trails: [],
    stories: [],
    expeditions: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim() || !supabase) {
      setResults({ peaks: [], trails: [], stories: [], expeditions: [] })
      return
    }

    const searchData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!supabase) {
          throw new Error('Supabase not configured')
        }

        const [peaksResult, trailsResult, storiesResult, expeditionsResult] = await Promise.all([
          supabase
            .from('peaks')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`),
          supabase
            .from('trails')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`),
          supabase
            .from('stories')
            .select('*')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`),
          supabase
            .from('expeditions')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        ])

        if (peaksResult.error || trailsResult.error || storiesResult.error || expeditionsResult.error) {
          throw new Error('Search failed')
        }

        setResults({
          peaks: peaksResult.data || [],
          trails: trailsResult.data || [],
          stories: storiesResult.data || [],
          expeditions: expeditionsResult.data || []
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchData, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return { results, loading, error }
}

// Hook for user's completed peaks and trails
export function useUserProgress(userId: string | null) {
  const supabase = createSupabaseClient()
  
  const peaksQuery = useSupabaseQuery<Array<{ peak: Peak }>>(
    async () => {
      if (!supabase || !userId) throw new Error('Supabase not configured or user ID missing')
      return await supabase
        .from('user_peaks')
        .select(`
          *,
          peak:peaks(*)
        `)
        .eq('user_id', userId)
    },
    [userId]
  )

  const trailsQuery = useSupabaseQuery<Array<{ trail: Trail }>>(
    async () => {
      if (!supabase || !userId) throw new Error('Supabase not configured or user ID missing')
      return await supabase
        .from('user_trails')
        .select(`
          *,
          trail:trails(*)
        `)
        .eq('user_id', userId)
    },
    [userId]
  )

  return {
    completedPeaks: peaksQuery.data || [],
    completedTrails: trailsQuery.data || [],
    loading: peaksQuery.loading || trailsQuery.loading,
    error: peaksQuery.error || trailsQuery.error
  }
}
