import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { hour: '8AM', hourAr: '8ص', orders: 5 },
  { hour: '9AM', hourAr: '9ص', orders: 12 },
  { hour: '10AM', hourAr: '10ص', orders: 18 },
  { hour: '11AM', hourAr: '11ص', orders: 15 },
  { hour: '12PM', hourAr: '12م', orders: 22 },
  { hour: '1PM', hourAr: '1م', orders: 28 },
  { hour: '2PM', hourAr: '2م', orders: 20 },
  { hour: '3PM', hourAr: '3م', orders: 16 },
  { hour: '4PM', hourAr: '4م', orders: 24 },
  { hour: '5PM', hourAr: '5م', orders: 30 },
  { hour: '6PM', hourAr: '6م', orders: 35 },
  { hour: '7PM', hourAr: '7م', orders: 32 },
];

export function OrdersByHourChart() {
  const { t, language } = useLanguage();
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold text-foreground mb-4">
        {t('الطلبات حسب الساعة', 'Orders by Hour')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis 
              dataKey={language === 'ar' ? 'hourAr' : 'hour'} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [value, t('طلب', 'Orders')]}
            />
            <Bar 
              dataKey="orders" 
              fill="hsl(120, 53%, 33%)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
