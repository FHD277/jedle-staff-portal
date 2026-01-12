import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function OrdersByHourChart() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // Fetch today's orders grouped by hour
  const { data: hourlyData = [] } = useQuery({
    queryKey: ['orders-by-hour', user?.tenant_id],
    queryFn: async () => {
      if (!user?.tenant_id) return [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('orders')
        .select('created_at')
        .eq('tenant_id', user.tenant_id)
        .gte('created_at', today.toISOString());

      if (error) throw error;

      // Initialize 24 hours
      const hourlyOrders: Record<number, number> = {};
      for (let i = 0; i < 24; i++) {
        hourlyOrders[i] = 0;
      }

      // Count orders per hour
      (data || []).forEach(order => {
        const hour = new Date(order.created_at).getHours();
        hourlyOrders[hour]++;
      });

      // Format for chart (only show hours with activity or business hours)
      return Object.entries(hourlyOrders)
        .map(([hour, count]) => ({
          hour: parseInt(hour),
          hourLabel: `${hour}:00`,
          hourLabelAr: `${hour}:00`,
          orders: count,
        }))
        .filter(item => item.hour >= 6 && item.hour <= 23); // Show 6 AM to 11 PM
    },
    enabled: !!user?.tenant_id,
  });
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold text-foreground mb-4">
        {t('الطلبات حسب الساعة', 'Orders by Hour')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis 
              dataKey={language === 'ar' ? 'hourLabelAr' : 'hourLabel'}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 11 }}
              interval={2} // Show every other hour
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [value, t('الطلبات', 'Orders')]}
              labelFormatter={(label) => `${label} ${t('', '')}`}
            />
            <Bar 
              dataKey="orders" 
              fill="hsl(120, 53%, 33%)" 
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}