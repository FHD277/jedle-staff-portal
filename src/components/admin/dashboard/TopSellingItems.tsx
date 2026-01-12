import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

export function TopSellingItems() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // Fetch top selling items
  const { data: topItems = [] } = useQuery({
    queryKey: ['top-selling-items', user?.tenant_id],
    queryFn: async () => {
      if (!user?.tenant_id) return [];

      // Get orders from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('orders')
        .select('items')
        .eq('tenant_id', user.tenant_id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .eq('payment_status', 'paid');

      if (error) throw error;

      // Aggregate items
      const itemCounts: Record<string, { name: string; nameAr: string; count: number }> = {};

      (data || []).forEach(order => {
        if (Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const itemName = item.name || 'Unknown';
            const itemNameAr = item.name_ar || item.nameAr || itemName;
            
            if (!itemCounts[itemName]) {
              itemCounts[itemName] = {
                name: itemName,
                nameAr: itemNameAr,
                count: 0,
              };
            }
            itemCounts[itemName].count += item.quantity || 1;
          });
        }
      });

      // Sort by count and take top 5
      return Object.values(itemCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((item, index) => ({
          rank: index + 1,
          name: item.name,
          nameAr: item.nameAr,
          orders: item.count,
        }));
    },
    enabled: !!user?.tenant_id,
  });
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold text-foreground mb-4">
        {t('الأصناف الأكثر مبيعاً', 'Top Selling Items')}
      </h3>
      <div className="space-y-3">
        {topItems.length > 0 ? (
          topItems.map((item) => (
            <div 
              key={item.rank}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary text-sm">{item.rank}</span>
                </div>
                <span className="font-medium text-foreground">
                  {language === 'ar' ? item.nameAr : item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-foreground">
                  {item.orders} {t('طلب', 'orders')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8 text-sm">
            {t('لا توجد بيانات كافية', 'Not enough data yet')}
          </p>
        )}
      </div>
    </div>
  );
}