import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('صباح الخير', 'Good morning');
    if (hour < 18) return t('مساء الخير', 'Good afternoon');
    return t('مساء الخير', 'Good evening');
  };
  
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
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="hidden md:inline">{t('أحمد', 'Ahmed')}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t('الملف الشخصي', 'Profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('الإعدادات', 'Settings')}</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">{t('تسجيل خروج', 'Logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
