export interface User {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  photo_url?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'player' | 'sponsor' | 'volunteer';
  created_at: Date;
  updated_at: Date;
}

export interface Sport {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  url_slug: string;
  admin_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SportEvent {
  id: string;
  sport_id: string;
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: string;
  sport_event_id: string;
  name: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface EventRole {
  id: string;
  sport_event_id: string;
  role_name: string;
  fee: number;
  created_at: Date;
}

export interface PlayerRegistration {
  id: string;
  sport_event_id: string;
  player_id: string;
  team_id?: string;
  role: string;
  jersey_name?: string;
  jersey_number?: string;
  jersey_size?: string;
  skill_level?: string;
  available_dates?: Date[];
  payment_status: 'pending' | 'done';
  fee_amount?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Sponsor {
  id: string;
  sport_event_id: string;
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  payment_status: 'pending' | 'done';
  amount_due: number;
  is_anonymous: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  user_id?: string;
  event_id?: string;
  amount: number;
  payment_method?: string;
  stripe_payment_id?: string;
  status: 'pending' | 'completed' | 'failed';
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
