import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

interface Order {
  id: string;
  customerAr: string;
  customerEn: string;
  total: number;
  status: OrderStatus;
  time: string;
  timeAr: string;
}

const orders: Order[] = [
  { id: '47', customerAr: 'أحمد', customerEn: 'Ahmed', total: 89, status: 'new', time: '2 min', timeAr: '2 د' },
  { id: '46', customerAr: 'سارة', customerEn: 'Sara', total: 52, status: 'preparing', time: '8 min', timeAr: '8 د' },
  { id: '45', customerAr: 'عمر', customerEn: 'Omar', total: 156, status: 'ready', time: '15 min', timeAr: '15 د' },
  { id: '44', customerAr: 'ليلى', customerEn: 'Layla', total: 78, status: 'completed', time: '45 min', timeAr: '45 د' },
];

const statusConfig: Record<OrderStatus, { labelAr: string; labelEn: string; className: string }> = {
  new: { labelAr: 'جديد', labelEn: 'New', className: 'status-new' },
  preparing: { labelAr: 'تحضير', labelEn: 'Preparing', className: 'status-preparing' },
  ready: { labelAr: 'جاهز', labelEn: 'Ready', className: 'status-ready' },
  completed: { labelAr: 'مكتمل', labelEn: 'Completed', className: 'status-completed' },
};

export function RecentOrders() {
  const { t, language, direction } = useLanguage();
  const Arrow = direction === 'rtl' ? ArrowLeft : ArrowRight;
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {t('آخر الطلبات', 'Recent Orders')}
        </h3>
        <Link 
          to="/orders" 
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {t('عرض الكل', 'View All')}
          <Arrow className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          return (
            <div 
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">#{order.id}</span>
                <span className="font-medium text-foreground">
                  {language === 'ar' ? order.customerAr : order.customerEn}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">﷼ {order.total}</span>
                <span className={cn('status-badge', status.className)}>
                  {language === 'ar' ? status.labelAr : status.labelEn}
                </span>
                <span className="text-xs text-muted-foreground">
                  {language === 'ar' ? order.timeAr : order.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
