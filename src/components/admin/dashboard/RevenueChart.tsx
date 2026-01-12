import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueChart() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // Fetch last 7 days revenue
  const { data: revenueData = [] } = useQuery({
    queryKey: ['revenue-chart', user?.tenant_id],
    queryFn: async () => {
      if (!user?.tenant_id) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total')
        .eq('tenant_id', user.tenant_id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .eq('payment_status', 'paid');

      if (error) throw error;

      // Group by day
      const groupedByDay: Record<string, number> = {};
      
      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayKeyAr = date.toLocaleDateString('ar-SA', { weekday: 'short' });
        groupedByDay[`${dayKey}|${dayKeyAr}`] = 0;
      }

      // Aggregate revenue by day
      (data || []).forEach(order => {
        const date = new Date(order.created_at);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayKeyAr = date.toLocaleDateString('ar-SA', { weekday: 'short' });
        const key = `${dayKey}|${dayKeyAr}`;
        
        if (groupedByDay[key] !== undefined) {
          groupedByDay[key] += parseFloat(order.total || 0);
        }
      });

      // Transform to chart format
      return Object.entries(groupedByDay).map(([key, revenue]) => {
        const [day, dayAr] = key.split('|');
        return {
          day,
          dayAr,
          revenue: Math.round(revenue),
        };
      });
    },
    enabled: !!user?.tenant_id,
  });
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold text-foreground mb-4">
        {t('الإيرادات (آخر 7 أيام)', 'Revenue (Last 7 Days)')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(120, 53%, 33%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(120, 53%, 33%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis 
              dataKey={language === 'ar' ? 'dayAr' : 'day'} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`﷼ ${value.toLocaleString()}`, t('الإيرادات', 'Revenue')]}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(120, 53%, 33%)" 
              strokeWidth={2}
              fill="url(#revenueGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}