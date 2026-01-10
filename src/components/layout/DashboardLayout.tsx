import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { direction } = useLanguage();
  
  return (
    <div className={cn("min-h-screen bg-background", direction === 'rtl' ? 'font-cairo' : 'font-sans')}>
      <AdminSidebar />
      <main 
        className={cn(
          "min-h-screen transition-all duration-300",
          direction === 'rtl' ? 'mr-64' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}
