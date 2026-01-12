import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { StaffUser } from '@/types/auth';

interface AuthContextType {
  user: StaffUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setLoading(false);
    }
  }

  async function fetchUserProfile(authUserId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', authUserId)  // ✅ FIXED: Changed from 'id' to 'auth_user_id'
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Staff profile not found');
      }

      setUser(data as StaffUser);
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('No user returned');

// Fetch staff profile using auth_user_id
const { data: staffData, error: staffError } = await supabase
  .from('admin_users')
  .select('*')
  .eq('auth_user_id', authData.user.id)
  .eq('is_active', true)
  .single();

// ADD THESE DEBUG LOGS:
console.log('Auth User ID:', authData.user.id);
console.log('Staff Data:', staffData);
console.log('Staff Error:', staffError);

if (staffError) {
  console.error('Staff lookup error:', staffError);
  throw new Error('Staff profile not found or inactive');
}
      setUser(staffData as StaffUser);

      // Redirect based on role
      if (staffData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/cashier');
      }

      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}