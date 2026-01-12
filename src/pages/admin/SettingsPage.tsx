import { AdminLayout } from '@/components/layout/DashboardLayout';
import { AdminHeader } from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Upload } from 'lucide-react';

export default function Settings() {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <AdminHeader 
        title={t('الإعدادات', 'Settings')} 
      />
      
      <div className="p-6 max-w-4xl space-y-8">
        {/* Business Info */}
        <section className="bg-card rounded-xl border p-6 space-y-6">
          <h2 className="text-lg font-semibold">
            {t('معلومات العمل', 'Business Info')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{t('اسم العمل (عربي)', 'Business Name (Arabic)')}</Label>
              <Input defaultValue="ديمو كافيه" />
            </div>
            <div className="space-y-2">
              <Label>{t('اسم العمل (إنجليزي)', 'Business Name (English)')}</Label>
              <Input defaultValue="Demo Cafe" />
            </div>
            <div className="space-y-2">
              <Label>{t('البريد الإلكتروني', 'Email')}</Label>
              <Input type="email" defaultValue="info@democafe.com" />
            </div>
            <div className="space-y-2">
              <Label>{t('رقم الهاتف', 'Phone')}</Label>
              <Input defaultValue="+966 12 345 6789" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t('الرقم الضريبي', 'Tax Number')}</Label>
              <Input defaultValue="300000000000003" />
            </div>
          </div>
        </section>
        
        {/* Branding */}
        <section className="bg-card rounded-xl border p-6 space-y-6">
          <h2 className="text-lg font-semibold">
            {t('الهوية البصرية', 'Branding')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>{t('الشعار', 'Logo')}</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('اسحب أو انقر للرفع', 'Drag or click to upload')}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('اللون الرئيسي', 'Primary Color')}</Label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary" />
                <Input defaultValue="#268526" className="font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('اللون الثانوي', 'Secondary Color')}</Label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-card border" />
                <Input defaultValue="#FFFFFF" className="font-mono" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Order Settings */}
        <section className="bg-card rounded-xl border p-6 space-y-6">
          <h2 className="text-lg font-semibold">
            {t('إعدادات الطلبات', 'Order Settings')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('تفعيل الاستلام', 'Enable Pickup')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('السماح للعملاء بالطلب والاستلام من المحل', 'Allow customers to order for pickup')}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('تفعيل التوصيل', 'Enable Delivery')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('السماح للعملاء بطلب التوصيل', 'Allow customers to order delivery')}
                </p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('تفعيل الطاولات', 'Enable Dine-in')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('السماح بالطلب من الطاولة', 'Allow table ordering')}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>{t('الحد الأدنى للطلب', 'Minimum Order')}</Label>
              <div className="relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">﷼</span>
                <Input defaultValue="0" className="ps-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('رسوم التوصيل', 'Delivery Fee')}</Label>
              <div className="relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">﷼</span>
                <Input defaultValue="10" className="ps-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('وقت التحضير الافتراضي', 'Default Prep Time')}</Label>
              <Input defaultValue="15 دقيقة" />
            </div>
          </div>
        </section>
        
        {/* Loyalty Settings */}
        <section className="bg-card rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t('إعدادات الولاء', 'Loyalty Settings')}
            </h2>
            <Switch defaultChecked />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{t('معدل الكسب', 'Earn Rate')}</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="0.8699" className="font-mono" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {t('نقطة لكل ﷼ 1', 'points per ﷼ 1')}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('معدل الاستخدام', 'Redeem Rate')}</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="20" className="font-mono" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {t('نقطة = ﷼ 1', 'points = ﷼ 1')}
                </span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">
            {t('حفظ الإعدادات', 'Save Settings')}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
