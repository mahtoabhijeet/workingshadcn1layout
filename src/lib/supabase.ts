import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase credentials are configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key'

// For client-side operations
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// For SSR operations (recommended for Next.js App Router)
export function createSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Helper function to check if Supabase is configured
export function isSupabaseReady() {
  return isSupabaseConfigured
}

// Database types (we'll expand this as we create tables)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      peaks: {
        Row: {
          id: string
          name: string
          elevation: number
          latitude: number
          longitude: number
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          elevation: number
          latitude: number
          longitude: number
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          elevation?: number
          latitude?: number
          longitude?: number
          difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trails: {
        Row: {
          id: string
          name: string
          distance: number
          duration: number
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          peak_id: string | null
          description: string | null
          start_latitude: number
          start_longitude: number
          end_latitude: number
          end_longitude: number
          elevation_gain: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          distance: number
          duration: number
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          peak_id?: string | null
          description?: string | null
          start_latitude: number
          start_longitude: number
          end_latitude: number
          end_longitude: number
          elevation_gain: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          distance?: number
          duration?: number
          difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
          peak_id?: string | null
          description?: string | null
          start_latitude?: number
          start_longitude?: number
          end_latitude?: number
          end_longitude?: number
          elevation_gain?: number
          created_at?: string
          updated_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          peak_id: string | null
          trail_id: string | null
          latitude: number | null
          longitude: number | null
          featured_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          peak_id?: string | null
          trail_id?: string | null
          latitude?: number | null
          longitude?: number | null
          featured_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          peak_id?: string | null
          trail_id?: string | null
          latitude?: number | null
          longitude?: number | null
          featured_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expeditions: {
        Row: {
          id: string
          name: string
          description: string
          organizer_id: string
          start_date: string
          end_date: string
          max_participants: number
          current_participants: number
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          status: 'planning' | 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          organizer_id: string
          start_date: string
          end_date: string
          max_participants: number
          current_participants?: number
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          organizer_id?: string
          start_date?: string
          end_date?: string
          max_participants?: number
          current_participants?: number
          difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: 'easy' | 'moderate' | 'hard' | 'extreme'
      expedition_status: 'planning' | 'active' | 'completed' | 'cancelled'
    }
  }
}
