import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  
  // Get user's first name
  const userName = (user as any)?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Ahmed';
  
  return (
    <header className="h-16 bg-card border-b flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Date Range Selector */}
        <Select defaultValue="today">
          <SelectTrigger className="w-36 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{t('اليوم', 'Today')}</SelectItem>
            <SelectItem value="yesterday">{t('أمس', 'Yesterday')}</SelectItem>
            <SelectItem value="7days">{t('آخر 7 أيام', 'Last 7 Days')}</SelectItem>
            <SelectItem value="30days">{t('آخر 30 يوم', 'Last 30 Days')}</SelectItem>
            <SelectItem value="month">{t('هذا الشهر', 'This Month')}</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="font-medium"
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </Button>
        
        {/* Notifications - NOW WITH DROPDOWN! */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b">
              <h3 className="font-semibold">{t('الإشعارات', 'Notifications')}</h3>
              <p className="text-xs text-muted-foreground">{t('لديك 3 إشعارات جديدة', 'You have 3 new notifications')}</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem className="p-4 cursor-pointer hover:bg-muted">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('طلب جديد #47', 'New order #47')}</p>
                    <p className="text-xs text-muted-foreground">{t('منذ دقيقتين', '2 minutes ago')}</p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-4 cursor-pointer hover:bg-muted">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('تذكرة دعم جديدة', 'New support ticket')}</p>
                    <p className="text-xs text-muted-foreground">{t('منذ 15 دقيقة', '15 minutes ago')}</p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-4 cursor-pointer hover:bg-muted">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('منتج نفذ من المخزون', 'Product out of stock')}</p>
                    <p className="text-xs text-muted-foreground">{t('منذ ساعة', '1 hour ago')}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="justify-center text-primary cursor-pointer">
              {t('عرض جميع الإشعارات', 'View all notifications')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="hidden md:inline">{userName}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t('الملف الشخصي', 'Profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('الإعدادات', 'Settings')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer"
              onClick={logout}
            >
              {t('تسجيل خروج', 'Logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}