export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      contribution_contributors: {
        Row: {
          contribution_id: string
          created_at: string
          id: string
          permissions: Json | null
          role: string
          user_id: string
        }
        Insert: {
          contribution_id: string
          created_at?: string
          id?: string
          permissions?: Json | null
          role: string
          user_id: string
        }
        Update: {
          contribution_id?: string
          created_at?: string
          id?: string
          permissions?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_contributors_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_files: {
        Row: {
          contribution_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          subtype_name: string | null
        }
        Insert: {
          contribution_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          subtype_name?: string | null
        }
        Update: {
          contribution_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          subtype_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_files_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_followups: {
        Row: {
          completed: boolean | null
          contribution_id: string
          created_at: string
          due_date: string | null
          followup_status: string
          id: string
          notes: string | null
          subtype_name: string | null
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          contribution_id: string
          created_at?: string
          due_date?: string | null
          followup_status: string
          id?: string
          notes?: string | null
          subtype_name?: string | null
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          contribution_id?: string
          created_at?: string
          due_date?: string | null
          followup_status?: string
          id?: string
          notes?: string | null
          subtype_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_followups_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_insights: {
        Row: {
          configuration: Json | null
          contribution_id: string
          created_at: string
          id: string
          insight_type: string
          subtype_name: string | null
        }
        Insert: {
          configuration?: Json | null
          contribution_id: string
          created_at?: string
          id?: string
          insight_type: string
          subtype_name?: string | null
        }
        Update: {
          configuration?: Json | null
          contribution_id?: string
          created_at?: string
          id?: string
          insight_type?: string
          subtype_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_insights_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_knots: {
        Row: {
          configuration: Json | null
          contribution_id: string
          created_at: string
          id: string
          knot_type: string
          linked_timeline_id: string | null
        }
        Insert: {
          configuration?: Json | null
          contribution_id: string
          created_at?: string
          id?: string
          knot_type: string
          linked_timeline_id?: string | null
        }
        Update: {
          configuration?: Json | null
          contribution_id?: string
          created_at?: string
          id?: string
          knot_type?: string
          linked_timeline_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_knots_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_knots_linked_timeline_id_fkey"
            columns: ["linked_timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_ratings: {
        Row: {
          comment: string | null
          contribution_id: string
          created_at: string
          id: string
          rater_user_id: string
          rating_value: number | null
        }
        Insert: {
          comment?: string | null
          contribution_id: string
          created_at?: string
          id?: string
          rater_user_id: string
          rating_value?: number | null
        }
        Update: {
          comment?: string | null
          contribution_id?: string
          created_at?: string
          id?: string
          rater_user_id?: string
          rating_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_ratings_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_setup_steps: {
        Row: {
          completed: boolean | null
          configuration: Json | null
          contribution_id: string
          created_at: string
          id: string
          skipped: boolean | null
          step_name: string
          step_number: number
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          configuration?: Json | null
          contribution_id: string
          created_at?: string
          id?: string
          skipped?: boolean | null
          step_name: string
          step_number: number
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          configuration?: Json | null
          contribution_id?: string
          created_at?: string
          id?: string
          skipped?: boolean | null
          step_name?: string
          step_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_setup_steps_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_smart_rules: {
        Row: {
          action: Json
          condition: Json
          contribution_id: string
          created_at: string
          enabled: boolean | null
          id: string
          rule_name: string
          subtype_name: string | null
        }
        Insert: {
          action: Json
          condition: Json
          contribution_id: string
          created_at?: string
          enabled?: boolean | null
          id?: string
          rule_name: string
          subtype_name?: string | null
        }
        Update: {
          action?: Json
          condition?: Json
          contribution_id?: string
          created_at?: string
          enabled?: boolean | null
          id?: string
          rule_name?: string
          subtype_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_smart_rules_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_subtypes: {
        Row: {
          configuration: Json | null
          contribution_id: string
          created_at: string
          direction: string
          id: string
          step_completed: boolean | null
          subtype_name: string
        }
        Insert: {
          configuration?: Json | null
          contribution_id: string
          created_at?: string
          direction: string
          id?: string
          step_completed?: boolean | null
          subtype_name: string
        }
        Update: {
          configuration?: Json | null
          contribution_id?: string
          created_at?: string
          direction?: string
          id?: string
          step_completed?: boolean | null
          subtype_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_subtypes_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_valuations: {
        Row: {
          amount: number | null
          breakdown: Json | null
          contribution_id: string
          created_at: string
          currency: string | null
          direction: string
          formula: string | null
          id: string
          subtype_name: string | null
          updated_at: string
          valuation_type: string
        }
        Insert: {
          amount?: number | null
          breakdown?: Json | null
          contribution_id: string
          created_at?: string
          currency?: string | null
          direction: string
          formula?: string | null
          id?: string
          subtype_name?: string | null
          updated_at?: string
          valuation_type: string
        }
        Update: {
          amount?: number | null
          breakdown?: Json | null
          contribution_id?: string
          created_at?: string
          currency?: string | null
          direction?: string
          formula?: string | null
          id?: string
          subtype_name?: string | null
          updated_at?: string
          valuation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_valuations_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          category: Database["public"]["Enums"]["contribution_category"]
          complete_later: boolean | null
          created_at: string
          creator_user_id: string
          description: string | null
          id: string
          is_timeline: boolean | null
          status: Database["public"]["Enums"]["contribution_status"]
          timeline_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["contribution_category"]
          complete_later?: boolean | null
          created_at?: string
          creator_user_id: string
          description?: string | null
          id?: string
          is_timeline?: boolean | null
          status?: Database["public"]["Enums"]["contribution_status"]
          timeline_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["contribution_category"]
          complete_later?: boolean | null
          created_at?: string
          creator_user_id?: string
          description?: string | null
          id?: string
          is_timeline?: boolean | null
          status?: Database["public"]["Enums"]["contribution_status"]
          timeline_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          onboarding_completed: boolean
          phone: string | null
          professional_role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          professional_role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          professional_role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      timelines: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          parent_timeline_id: string | null
          timeline_type: Database["public"]["Enums"]["timeline_type"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          parent_timeline_id?: string | null
          timeline_type?: Database["public"]["Enums"]["timeline_type"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          parent_timeline_id?: string | null
          timeline_type?: Database["public"]["Enums"]["timeline_type"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timelines_parent_timeline_id_fkey"
            columns: ["parent_timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contribution_types: {
        Row: {
          contribution_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          contribution_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          contribution_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_expectations: {
        Row: {
          created_at: string
          expectation: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expectation: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expectation?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interest_areas: {
        Row: {
          category: string
          created_at: string
          id: string
          interest: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          interest: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          interest?: string
          user_id?: string
        }
        Relationships: []
      }
      user_outcome_sharing: {
        Row: {
          created_at: string
          id: string
          outcome_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          outcome_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          outcome_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_verification_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      asset_subtype:
        | "farm_tools"
        | "land"
        | "livestock"
        | "seeds"
        | "construction_tools"
        | "houses"
        | "office_tools"
        | "office_spaces"
        | "digital_assets"
        | "software"
        | "data_assets"
        | "vehicles"
        | "custom"
      contribution_category:
        | "financial"
        | "intellectual"
        | "marketing"
        | "assets"
      contribution_status:
        | "draft"
        | "setup_incomplete"
        | "ready_to_receive"
        | "ready_to_give"
        | "negotiating"
        | "active"
        | "completed"
        | "cancelled"
      financial_subtype:
        | "cash"
        | "debt"
        | "equity"
        | "revenue_share"
        | "profit_share"
        | "pledges"
      intellectual_subtype:
        | "coaching"
        | "tutoring"
        | "project_development"
        | "project_planning"
        | "mentorship"
        | "consultation"
        | "research"
        | "perspectives"
        | "customer_support"
        | "capacity_building"
      marketing_subtype:
        | "leads_onboarding"
        | "leads_followup"
        | "leads_conversion"
        | "leads_retention"
      timeline_type:
        | "personal"
        | "profile"
        | "project"
        | "financial"
        | "intellectual"
        | "marketing"
        | "assets"
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
    Enums: {
      asset_subtype: [
        "farm_tools",
        "land",
        "livestock",
        "seeds",
        "construction_tools",
        "houses",
        "office_tools",
        "office_spaces",
        "digital_assets",
        "software",
        "data_assets",
        "vehicles",
        "custom",
      ],
      contribution_category: [
        "financial",
        "intellectual",
        "marketing",
        "assets",
      ],
      contribution_status: [
        "draft",
        "setup_incomplete",
        "ready_to_receive",
        "ready_to_give",
        "negotiating",
        "active",
        "completed",
        "cancelled",
      ],
      financial_subtype: [
        "cash",
        "debt",
        "equity",
        "revenue_share",
        "profit_share",
        "pledges",
      ],
      intellectual_subtype: [
        "coaching",
        "tutoring",
        "project_development",
        "project_planning",
        "mentorship",
        "consultation",
        "research",
        "perspectives",
        "customer_support",
        "capacity_building",
      ],
      marketing_subtype: [
        "leads_onboarding",
        "leads_followup",
        "leads_conversion",
        "leads_retention",
      ],
      timeline_type: [
        "personal",
        "profile",
        "project",
        "financial",
        "intellectual",
        "marketing",
        "assets",
      ],
    },
  },
} as const
