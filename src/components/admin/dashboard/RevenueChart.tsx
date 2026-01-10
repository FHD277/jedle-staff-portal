import { useLanguage } from '@/contexts/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Sat', dayAr: 'السبت', revenue: 2400 },
  { day: 'Sun', dayAr: 'الأحد', revenue: 1398 },
  { day: 'Mon', dayAr: 'الإثنين', revenue: 3200 },
  { day: 'Tue', dayAr: 'الثلاثاء', revenue: 2780 },
  { day: 'Wed', dayAr: 'الأربعاء', revenue: 1890 },
  { day: 'Thu', dayAr: 'الخميس', revenue: 3490 },
  { day: 'Fri', dayAr: 'الجمعة', revenue: 3250 },
];

export function RevenueChart() {
  const { t, language } = useLanguage();
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold text-foreground mb-4">
        {t('الإيرادات (آخر 7 أيام)', 'Revenue (Last 7 Days)')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
