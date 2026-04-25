export type UserRole = "customer" | "staff" | "admin";

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "picked_up"
  | "cancelled";

export type FulfillmentType = "delivery" | "pickup";

export type PaymentStatus = "pending" | "success" | "failed";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  saved_address: string | null;
  email_subscribed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  fulfillment_type: FulfillmentType;
  delivery_address: string | null;
  note: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  snapshot_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Payment {
  id: string;
  order_id: string;
  paystack_reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

export interface BroadcastEmail {
  id: string;
  subject: string;
  body: string;
  sent_by: string;
  recipient_count: number;
  sent_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  tiktok_handle: string | null;
  instagram_handle: string | null;
  delivery_fee: number;
  estimated_delivery_time: string | null;
  pickup_ready_time: string | null;
  delivery_coverage_note: string | null;
  updated_at: string;
}

export interface OperatingHours {
  id: string;
  day_name: string;
  open_time: string | null;
  close_time: string | null;
  is_open: boolean;
}

type SupabaseRow<T extends object> = T & Record<string, unknown>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: SupabaseRow<Profile>;
        Insert: SupabaseRow<Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        }>;
        Update: SupabaseRow<Partial<Profile>>;
        Relationships: [];
      };
      menu_items: {
        Row: SupabaseRow<MenuItem>;
        Insert: SupabaseRow<
          Omit<MenuItem, "id" | "created_at" | "updated_at" | "sort_order"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          sort_order?: number;
        }
        >;
        Update: SupabaseRow<Partial<MenuItem>>;
        Relationships: [];
      };
      orders: {
        Row: SupabaseRow<Order>;
        Insert: SupabaseRow<Omit<Order, "id" | "order_number" | "created_at" | "updated_at"> & {
          id?: string;
          order_number?: string;
          created_at?: string;
          updated_at?: string;
        }>;
        Update: SupabaseRow<Partial<Order>>;
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: SupabaseRow<OrderItem>;
        Insert: SupabaseRow<Omit<OrderItem, "id" | "line_total"> & {
          id?: string;
          line_total?: number;
        }>;
        Update: SupabaseRow<Partial<OrderItem>>;
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: SupabaseRow<Payment>;
        Insert: SupabaseRow<Omit<Payment, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        }>;
        Update: SupabaseRow<Partial<Payment>>;
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: true;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      broadcast_emails: {
        Row: SupabaseRow<BroadcastEmail>;
        Insert: SupabaseRow<Omit<BroadcastEmail, "id" | "sent_at"> & {
          id?: string;
          sent_at?: string;
        }>;
        Update: SupabaseRow<Partial<BroadcastEmail>>;
        Relationships: [
          {
            foreignKeyName: "broadcast_emails_sent_by_fkey";
            columns: ["sent_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      business_settings: {
        Row: SupabaseRow<BusinessSettings>;
        Insert: SupabaseRow<Omit<BusinessSettings, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        }>;
        Update: SupabaseRow<Partial<BusinessSettings>>;
        Relationships: [];
      };
      operating_hours: {
        Row: SupabaseRow<OperatingHours>;
        Insert: SupabaseRow<Omit<OperatingHours, "id"> & {
          id?: string;
        }>;
        Update: SupabaseRow<Partial<OperatingHours>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type PublicSchema = Database["public"];

export type TableName = keyof PublicSchema["Tables"];

export type TableRow<T extends TableName> = PublicSchema["Tables"][T]["Row"];

export type TableInsert<T extends TableName> =
  PublicSchema["Tables"][T]["Insert"];

export type TableUpdate<T extends TableName> =
  PublicSchema["Tables"][T]["Update"];
