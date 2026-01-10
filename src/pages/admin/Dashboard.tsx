import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { StatCard } from '@/admin/dashboard/StatCard';
import { RevenueChart } from '@/admin/dashboard/RevenueChart';
import { OrdersByHourChart } from '@/admin/dashboard/OrdersByHourChart';
import { TopSellingItems } from '@/admin/dashboard/TopSellingItems';
import { RecentOrders } from '@/admin/dashboard/RecentOrders';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClipboardList, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('صباح الخير، أحمد!', 'Good morning, Ahmed!');
    if (hour < 18) return t('مساء الخير، أحمد!', 'Good afternoon, Ahmed!');
    return t('مساء الخير، أحمد!', 'Good evening, Ahmed!');
  };
  
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
            value={47}
            change={15}
          />
          <StatCard
            icon={DollarSign}
            title={t('الإيرادات', 'Revenue')}
            value="3,250"
            prefix="﷼ "
            change={8}
          />
          <StatCard
            icon={TrendingUp}
            title={t('متوسط الطلب', 'Avg Order')}
            value={69}
            prefix="﷼ "
            change={3}
          />
          <StatCard
            icon={Users}
            title={t('عملاء جدد', 'New Customers')}
            value={12}
            change={25}
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
