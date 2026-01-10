import { useLanguage } from '@/contexts/LanguageContext';

const items = [
  { nameAr: 'سبانش لاتيه', nameEn: 'Spanish Latte', orders: 89 },
  { nameAr: 'كرواسون جبنة', nameEn: 'Cheese Croissant', orders: 67 },
  { nameAr: 'كولد برو', nameEn: 'Cold Brew', orders: 54 },
  { nameAr: 'كيكة التمر', nameEn: 'Date Cake', orders: 43 },
  { nameAr: 'لاتيه', nameEn: 'Latte', orders: 38 },
];

export function TopSellingItems() {
  const { t, language } = useLanguage();
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold text-foreground mb-4">
        {t('الأصناف الأكثر مبيعاً', 'Top Selling Items')}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <span className="font-medium text-foreground">
                {language === 'ar' ? item.nameAr : item.nameEn}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {item.orders} {t('طلب', 'orders')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
