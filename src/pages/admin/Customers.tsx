import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Customer {
  id: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  orders: number;
  totalSpent: number;
  points: number;
  lastOrderAr: string;
  lastOrderEn: string;
}

const customers: Customer[] = [
  { id: '1', nameAr: 'أحمد محمد', nameEn: 'Ahmed Mohammed', phone: '+966 512345678', orders: 23, totalSpent: 1890, points: 1643, lastOrderAr: 'اليوم', lastOrderEn: 'Today' },
  { id: '2', nameAr: 'سارة علي', nameEn: 'Sara Ali', phone: '+966 523456789', orders: 15, totalSpent: 1234, points: 1073, lastOrderAr: 'أمس', lastOrderEn: 'Yesterday' },
  { id: '3', nameAr: 'عمر خالد', nameEn: 'Omar Khaled', phone: '+966 534567890', orders: 8, totalSpent: 567, points: 493, lastOrderAr: '3 أيام', lastOrderEn: '3 days ago' },
  { id: '4', nameAr: 'ليلى أحمد', nameEn: 'Layla Ahmed', phone: '+966 545678901', orders: 5, totalSpent: 345, points: 300, lastOrderAr: 'أسبوع', lastOrderEn: '1 week ago' },
  { id: '5', nameAr: 'محمد سعيد', nameEn: 'Mohammed Saeed', phone: '+966 556789012', orders: 12, totalSpent: 876, points: 761, lastOrderAr: '2 أيام', lastOrderEn: '2 days ago' },
  { id: '6', nameAr: 'نورة فهد', nameEn: 'Noura Fahad', phone: '+966 567890123', orders: 7, totalSpent: 543, points: 472, lastOrderAr: '5 أيام', lastOrderEn: '5 days ago' },
];

export default function Customers() {
  const { t, language, direction } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <AdminLayout>
      <AdminHeader 
        title={t('العملاء', 'Customers')} 
      />
      
      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
              direction === 'rtl' ? 'right-3' : 'left-3'
            )} />
            <Input
              placeholder={t('بحث بالاسم أو الهاتف أو البريد...', 'Search by name, phone, or email...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(direction === 'rtl' ? 'pr-10' : 'pl-10')}
            />
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            {t('تصدير CSV', 'Export CSV')}
          </Button>
        </div>
        
        {/* Customers Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('العميل', 'Customer')}</th>
                  <th>{t('الهاتف', 'Phone')}</th>
                  <th>{t('الطلبات', 'Orders')}</th>
                  <th>{t('إجمالي الإنفاق', 'Total Spent')}</th>
                  <th>{t('النقاط', 'Points')}</th>
                  <th>{t('آخر طلب', 'Last Order')}</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="cursor-pointer">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                          {(language === 'ar' ? customer.nameAr : customer.nameEn).charAt(0)}
                        </div>
                        <span className="font-medium">
                          {language === 'ar' ? customer.nameAr : customer.nameEn}
                        </span>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{customer.phone}</td>
                    <td>{customer.orders}</td>
                    <td className="font-medium">﷼ {customer.totalSpent.toLocaleString()}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-warning">
                        <span>⭐</span>
                        {customer.points.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {language === 'ar' ? customer.lastOrderAr : customer.lastOrderEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              {t('عرض 1-6 من 156 عميل', 'Showing 1-6 of 156 customers')}
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
