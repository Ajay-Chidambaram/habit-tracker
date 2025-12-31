/**
 * Supabase Database Types
 * 
 * This file should be generated using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
 * 
 * Or using the Supabase CLI:
 * supabase gen types typescript --local > lib/supabase/types.ts
 * 
 * For now, this is a placeholder. Replace with generated types after running the migration.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      weekly_entries: {
        Row: {
          id: string
          user_id: string
          week_start: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      habits: {
        Row: {
          id: string
          entry_id: string
          name: string
          target_frequency: number
          completed_count: number
          notes: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          name: string
          target_frequency?: number
          completed_count?: number
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          name?: string
          target_frequency?: number
          completed_count?: number
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_entry_id_fkey"
            columns: ["entry_id"]
            referencedRelation: "weekly_entries"
            referencedColumns: ["id"]
          }
        ]
      }
      side_projects: {
        Row: {
          id: string
          entry_id: string
          name: string
          goal: string | null
          status: 'not_started' | 'in_progress' | 'completed'
          notes: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          name: string
          goal?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          name?: string
          goal?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "side_projects_entry_id_fkey"
            columns: ["entry_id"]
            referencedRelation: "weekly_entries"
            referencedColumns: ["id"]
          }
        ]
      }
      purchases_research: {
        Row: {
          id: string
          entry_id: string
          item_name: string
          category: 'purchase' | 'research'
          priority: 'low' | 'medium' | 'high'
          status: 'researching' | 'decided' | 'purchased' | 'dropped'
          notes: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          item_name: string
          category?: 'purchase' | 'research'
          priority?: 'low' | 'medium' | 'high'
          status?: 'researching' | 'decided' | 'purchased' | 'dropped'
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          item_name?: string
          category?: 'purchase' | 'research'
          priority?: 'low' | 'medium' | 'high'
          status?: 'researching' | 'decided' | 'purchased' | 'dropped'
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_research_entry_id_fkey"
            columns: ["entry_id"]
            referencedRelation: "weekly_entries"
            referencedColumns: ["id"]
          }
        ]
      }
      experiences_travel: {
        Row: {
          id: string
          entry_id: string
          title: string
          planned_date: string | null
          type: 'travel' | 'event' | 'experience'
          status: 'planning' | 'booked' | 'completed'
          notes: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          title: string
          planned_date?: string | null
          type?: 'travel' | 'event' | 'experience'
          status?: 'planning' | 'booked' | 'completed'
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          title?: string
          planned_date?: string | null
          type?: 'travel' | 'event' | 'experience'
          status?: 'planning' | 'booked' | 'completed'
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_travel_entry_id_fkey"
            columns: ["entry_id"]
            referencedRelation: "weekly_entries"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

