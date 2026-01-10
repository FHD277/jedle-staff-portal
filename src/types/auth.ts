export type StaffRole = 'admin' | 'cashier';

export interface StaffUser {
  id: string;
  email: string;
  role: StaffRole;
  tenant_id: string;
  branch_id?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: StaffUser | null;
  loading: boolean;
}