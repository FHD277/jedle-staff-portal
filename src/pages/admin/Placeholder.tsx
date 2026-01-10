import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  titleAr: string;
  titleEn: string;
}

export default function Placeholder({ titleAr, titleEn }: PlaceholderProps) {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <AdminHeader title={t(titleAr, titleEn)} />
      
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {t('قيد التطوير', 'Coming Soon')}
          </h2>
          <p className="text-muted-foreground">
            {t('هذه الصفحة قيد التطوير وستكون متاحة قريباً', 'This page is under development and will be available soon')}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
