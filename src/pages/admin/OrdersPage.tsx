import { useState } from 'react';
import { AdminLayout } from '@/components/layout/DashboardLayout';
import { AdminHeader } from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';
type OrderType = 'pickup' | 'dine-in';

interface Order {
  id: string;
  customerAr: string;
  customerEn: string;
  type: OrderType;
  typeAr: string;
  typeEn: string;
  items: number;
  total: number;
  status: OrderStatus;
  time: string;
  timeAr: string;
}

const orders: Order[] = [
  { id: '047', customerAr: 'أحمد محمد', customerEn: 'Ahmed Mohammed', type: 'pickup', typeAr: 'استلام', typeEn: 'Pickup', items: 3, total: 89, status: 'new', time: '2 min', timeAr: '2 د' },
  { id: '046', customerAr: 'سارة علي', customerEn: 'Sara Ali', type: 'pickup', typeAr: 'استلام', typeEn: 'Pickup', items: 2, total: 52, status: 'preparing', time: '8 min', timeAr: '8 د' },
  { id: '045', customerAr: 'عمر خالد', customerEn: 'Omar Khaled', type: 'dine-in', typeAr: 'طاولة 5', typeEn: 'Table 5', items: 5, total: 156, status: 'ready', time: '15 min', timeAr: '15 د' },
  { id: '044', customerAr: 'ليلى أحمد', customerEn: 'Layla Ahmed', type: 'pickup', typeAr: 'استلام', typeEn: 'Pickup', items: 3, total: 78, status: 'completed', time: '45 min', timeAr: '45 د' },
  { id: '043', customerAr: 'محمد سعيد', customerEn: 'Mohammed Saeed', type: 'pickup', typeAr: 'استلام', typeEn: 'Pickup', items: 1, total: 25, status: 'completed', time: '1 hr', timeAr: '1 س' },
  { id: '042', customerAr: 'نورة فهد', customerEn: 'Noura Fahad', type: 'dine-in', typeAr: 'طاولة 3', typeEn: 'Table 3', items: 4, total: 134, status: 'completed', time: '2 hr', timeAr: '2 س' },
];

const statusConfig: Record<OrderStatus, { labelAr: string; labelEn: string; className: string }> = {
  new: { labelAr: 'جديد', labelEn: 'New', className: 'status-new' },
  preparing: { labelAr: 'تحضير', labelEn: 'Preparing', className: 'status-preparing' },
  ready: { labelAr: 'جاهز', labelEn: 'Ready', className: 'status-ready' },
  completed: { labelAr: 'مكتمل', labelEn: 'Completed', className: 'status-completed' },
};

export default function Orders() {
  const { t, language, direction } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <AdminLayout>
      <AdminHeader 
        title={t('الطلبات', 'Orders')} 
      />
      
      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                direction === 'rtl' ? 'right-3' : 'left-3'
              )} />
              <Input
                placeholder={t('بحث برقم الطلب أو اسم العميل...', 'Search by order # or customer name...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(direction === 'rtl' ? 'pr-10' : 'pl-10')}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('الحالة', 'Status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
                <SelectItem value="new">{t('جديد', 'New')}</SelectItem>
                <SelectItem value="preparing">{t('تحضير', 'Preparing')}</SelectItem>
                <SelectItem value="ready">{t('جاهز', 'Ready')}</SelectItem>
                <SelectItem value="completed">{t('مكتمل', 'Completed')}</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('النوع', 'Type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
                <SelectItem value="pickup">{t('استلام', 'Pickup')}</SelectItem>
                <SelectItem value="dine-in">{t('طاولة', 'Dine-in')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">{t('تصدير CSV', 'Export CSV')}</span>
            </Button>
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">{t('طلب يدوي', 'Manual Order')}</span>
            </Button>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('رقم الطلب', 'Order #')}</th>
                  <th>{t('العميل', 'Customer')}</th>
                  <th>{t('النوع', 'Type')}</th>
                  <th>{t('العناصر', 'Items')}</th>
                  <th>{t('الإجمالي', 'Total')}</th>
                  <th>{t('الحالة', 'Status')}</th>
                  <th>{t('الوقت', 'Time')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="cursor-pointer">
                      <td className="font-mono font-medium">#{order.id}</td>
                      <td className="font-medium">
                        {language === 'ar' ? order.customerAr : order.customerEn}
                      </td>
                      <td>
                        {language === 'ar' ? order.typeAr : order.typeEn}
                      </td>
                      <td>{order.items}</td>
                      <td className="font-medium">﷼ {order.total}</td>
                      <td>
                        <span className={cn('status-badge', status.className)}>
                          {language === 'ar' ? status.labelAr : status.labelEn}
                        </span>
                      </td>
                      <td className="text-muted-foreground">
                        {language === 'ar' ? order.timeAr : order.time}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              {t('صفحة 1 من 15', 'Page 1 of 15')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                {t('السابق', 'Previous')}
              </Button>
              <Button variant="outline" size="sm">
                {t('التالي', 'Next')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
