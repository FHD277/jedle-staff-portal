import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Tenant {
  id: string;
  slug: string;
  business_name: string;
  business_name_ar: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  currency: string;
  timezone: string;
  email?: string;
  phone?: string;
  loyalty_enabled: boolean;
  loyalty_earn_rate: number;
  loyalty_redeem_rate: number;
  tax_rate: number;
  features: {
    pickup: boolean;
    delivery: boolean;
    dine_in: boolean;
    wallet: boolean;
  };
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.tenant_id) {
      fetchTenant(user.tenant_id);
    } else {
      setLoading(false);
    }
  }, [user?.tenant_id]);

  async function fetchTenant(tenantId: string) {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) throw error;

      setTenant(data as Tenant);
    } catch (error) {
      console.error('Error fetching tenant:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}