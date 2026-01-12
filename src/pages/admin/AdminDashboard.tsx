import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/DashboardLayout';
import { AdminHeader } from '@/components/layout/Header';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { OrdersByHourChart } from '@/components/admin/dashboard/OrdersByHourChart';
import { TopSellingItems } from '@/components/admin/dashboard/TopSellingItems';
import { RecentOrders } from '@/components/admin/dashboard/RecentOrders';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClipboardList, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    // Try to get name from full_name or email
    const userData = user as any;
    const name = userData?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Ahmed';
    
    if (hour < 12) return t(`صباح الخير، ${name}!`, `Good morning, ${name}!`);
    if (hour < 18) return t(`مساء الخير، ${name}!`, `Good afternoon, ${name}!`);
    return t(`مساء الخير، ${name}!`, `Good evening, ${name}!`);
  };

  // Fetch today's stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', user?.tenant_id],
    queryFn: async () => {
      if (!user?.tenant_id) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get yesterday for comparison
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Today's orders
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total, status, created_at')
        .eq('tenant_id', user.tenant_id)
        .gte('created_at', today.toISOString());

      // Yesterday's orders for comparison
      const { data: yesterdayOrders } = await supabase
        .from('orders')
        .select('total')
        .eq('tenant_id', user.tenant_id)
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString());

      const todayRevenue = todayOrders?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;
      const yesterdayRevenue = yesterdayOrders?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;
      
      const todayOrdersCount = todayOrders?.length || 0;
      const yesterdayOrdersCount = yesterdayOrders?.length || 0;
      
      const avgOrder = todayOrdersCount > 0 ? todayRevenue / todayOrdersCount : 0;
      const yesterdayAvgOrder = yesterdayOrdersCount > 0 ? yesterdayRevenue / yesterdayOrdersCount : 0;

      // Calculate percentage changes
      const ordersChange = yesterdayOrdersCount > 0 
        ? Math.round(((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) * 100)
        : 0;
      
      const revenueChange = yesterdayRevenue > 0
        ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
        : 0;
      
      const avgOrderChange = yesterdayAvgOrder > 0
        ? Math.round(((avgOrder - yesterdayAvgOrder) / yesterdayAvgOrder) * 100)
        : 0;

      return {
        orders: todayOrdersCount,
        ordersChange,
        revenue: todayRevenue,
        revenueChange,
        avgOrder,
        avgOrderChange,
        newCustomers: 12, // Placeholder - needs customer tracking
        newCustomersChange: 25, // Placeholder
      };
    },
    enabled: !!user?.tenant_id,
  });
  
  return (
    <AdminLayout>
      <AdminHeader 
        title={getGreeting()} 
        subtitle={t('ملخص اليوم', "Today's Summary")} 
      />
      
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={ClipboardList}
            title={t('الطلبات', 'Orders')}
            value={stats?.orders || 0}
            change={stats?.ordersChange}
          />
          <StatCard
            icon={DollarSign}
            title={t('الإيرادات', 'Revenue')}
            value={stats?.revenue?.toFixed(0) || '0'}
            prefix="﷼ "
            change={stats?.revenueChange}
          />
          <StatCard
            icon={TrendingUp}
            title={t('متوسط الطلب', 'Avg Order')}
            value={stats?.avgOrder?.toFixed(0) || '0'}
            prefix="﷼ "
            change={stats?.avgOrderChange}
          />
          <StatCard
            icon={Users}
            title={t('عملاء جدد', 'New Customers')}
            value={stats?.newCustomers || 0}
            change={stats?.newCustomersChange}
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <OrdersByHourChart />
        </div>
        
        {/* Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSellingItems />
          <RecentOrders />
        </div>
      </div>
    </AdminLayout>
  );
}