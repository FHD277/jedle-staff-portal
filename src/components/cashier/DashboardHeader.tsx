import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  Volume2, 
  VolumeX, 
  Settings, 
  ChevronDown,
  Coffee,
  LogOut,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export function DashboardHeader({
  soundEnabled,
  onToggleSound,
  onLogout,
  onOpenSettings,
}: DashboardHeaderProps) {
  const { t, language, setLanguage, isRTL } = useLanguage();
  
  return (
    <header className="h-16 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sound Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSound}
          className={soundEnabled ? 'text-primary' : 'text-muted-foreground'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Coffee className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground leading-tight">Demo Cafe</h1>
            <p className="text-xs text-muted-foreground">{t('dashboard.title')}</p>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Branch Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span>{t('dashboard.branch')}: {t('dashboard.mainBranch')}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <span className="w-2 h-2 bg-status-ready rounded-full" />
              {t('dashboard.mainBranch')}
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-muted-foreground">
              <span className="w-2 h-2 bg-muted rounded-full" />
              {language === 'ar' ? 'فرع العليا' : 'Olaya Branch'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Language Toggle */}
        <div className="inline-flex rounded-lg bg-muted p-0.5">
          <button
            onClick={() => setLanguage('ar')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              language === 'ar' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            AR
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              language === 'en' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            EN
          </button>
        </div>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="hidden sm:inline">{language === 'ar' ? 'أحمد' : 'Ahmed'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onOpenSettings} className="gap-2">
              <Settings className="w-4 h-4" />
              {t('settings.title')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="gap-2 text-destructive">
              <LogOut className="w-4 h-4" />
              {t('misc.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
