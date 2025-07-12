export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          assignment_id: string
          feedback: string | null
          file_url: string | null
          graded_at: string | null
          id: string
          score: number | null
          submission_text: string | null
          submitted_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          id?: string
          score?: number | null
          submission_text?: string | null
          submitted_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          id?: string
          score?: number | null
          submission_text?: string | null
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          course_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          max_points: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          max_points?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          max_points?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_name: string
          certificate_url: string | null
          course_id: string | null
          id: string
          issued_date: string
          user_id: string
          verification_code: string
        }
        Insert: {
          certificate_name: string
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_date?: string
          user_id: string
          verification_code?: string
        }
        Update: {
          certificate_name?: string
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          issued_date?: string
          user_id?: string
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed: boolean | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          content: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          lesson_type: string | null
          module_id: string | null
          order_index: number
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          youtube_video_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          order_index?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          order_index?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_locked: boolean | null
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_locked?: boolean | null
          order_index?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_locked?: boolean | null
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          review_text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          instructor: string | null
          is_featured: boolean | null
          level: string | null
          price: number | null
          rating: number | null
          students_enrolled: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_featured?: boolean | null
          level?: string | null
          price?: number | null
          rating?: number | null
          students_enrolled?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_featured?: boolean | null
          level?: string | null
          price?: number | null
          rating?: number | null
          students_enrolled?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          id: string
          job_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          job_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          job_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          posted_by: string | null
          requirements: string[] | null
          salary_range: string | null
          skills_required: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          skills_required?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          skills_required?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      labs: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          duration: string | null
          gradient_colors: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          participants: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          gradient_colors?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          participants?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          gradient_colors?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          participants?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          category: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_course_review: {
        Args: { p_course_id: string; p_rating: number; p_review_text: string }
        Returns: undefined
      }
      create_course_lesson: {
        Args: {
          p_module_id: string
          p_title: string
          p_content: string
          p_video_url: string
          p_duration_minutes: number
          p_order_index: number
          p_lesson_type: string
        }
        Returns: string
      }
      create_course_module: {
        Args: {
          p_course_id: string
          p_title: string
          p_description: string
          p_duration_minutes: number
          p_order_index: number
        }
        Returns: string
      }
      get_course_lessons: {
        Args: { p_module_id: string }
        Returns: {
          id: string
          module_id: string
          title: string
          content: string
          video_url: string
          duration_minutes: number
          order_index: number
          lesson_type: string
          created_at: string
          updated_at: string
        }[]
      }
      get_course_modules: {
        Args: { p_course_id: string }
        Returns: {
          id: string
          course_id: string
          title: string
          description: string
          order_index: number
          duration_minutes: number
          is_locked: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_course_reviews: {
        Args: { p_course_id: string }
        Returns: {
          id: string
          course_id: string
          user_id: string
          rating: number
          review_text: string
          created_at: string
          updated_at: string
          full_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
